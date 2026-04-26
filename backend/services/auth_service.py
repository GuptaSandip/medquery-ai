from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime

from models.user import User, AuthProvider, UserRole
from schemas.auth import SignupRequest, LoginRequest, TokenResponse
from utils.hashing import hash_password, verify_password
from utils.jwt_handler import (
    create_access_token,
    create_refresh_token,
    decode_token,
)


class AuthService:

    @staticmethod
    def signup(request: SignupRequest, db: Session) -> TokenResponse:
        """Register new user"""

        try:
            # Check if email already exists
            existing_user = db.query(User).filter(
                User.email == request.email
            ).first()

            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Email already registered"
                )

            # Hash password
            hashed_password = hash_password(request.password)

            # Create user
            new_user = User(
                full_name=request.full_name,
                email=request.email,
                hashed_password=hashed_password,
                auth_provider=AuthProvider.LOCAL.value,
                role=UserRole.USER.value,
                is_active=True,
                is_verified=False
            )

            db.add(new_user)
            db.commit()
            db.refresh(new_user)

            # Generate tokens
            token_data = {"sub": str(new_user.id), "email": new_user.email}
            access_token = create_access_token(token_data)
            refresh_token = create_refresh_token(token_data)

            return TokenResponse(
                access_token=access_token,
                refresh_token=refresh_token
            )

        except HTTPException:
            raise

        except Exception as e:
            print("🔥 SIGNUP ERROR:", str(e))   # 👈 VERY IMPORTANT
            raise HTTPException(
                status_code=500,
                detail=str(e)
            )

    @staticmethod
    def login(request: LoginRequest, db: Session) -> TokenResponse:
        """Login existing user"""

        try:
            user = db.query(User).filter(
                User.email == request.email
            ).first()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password"
                )

            # Check provider
            if user.auth_provider == AuthProvider.GOOGLE.value:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="This account uses Google login."
                )

            # Verify password
            if not verify_password(request.password, user.hashed_password):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password"
                )

            # Check active
            if not user.is_active:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Account is deactivated"
                )

            # Update last login
            user.last_login = datetime.utcnow()
            db.commit()

            # Generate tokens
            token_data = {"sub": str(user.id), "email": user.email}
            access_token = create_access_token(token_data)
            refresh_token = create_refresh_token(token_data)

            return TokenResponse(
                access_token=access_token,
                refresh_token=refresh_token
            )

        except HTTPException:
            raise

        except Exception as e:
            print("🔥 LOGIN ERROR:", str(e))   # 👈 DEBUG
            raise HTTPException(
                status_code=500,
                detail=str(e)
            )

    @staticmethod
    def refresh_tokens(refresh_token: str, db: Session) -> TokenResponse:
        """Issue fresh tokens using a valid refresh token"""

        try:
            payload = decode_token(refresh_token)

            if not payload:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid or expired refresh token",
                )

            if payload.get("type") != "refresh":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token type",
                )

            user_id = payload.get("sub")
            if not user_id:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token missing user ID",
                )

            user = db.query(User).filter(User.id == int(user_id)).first()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found",
                )

            if not user.is_active:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Account is deactivated",
                )

            token_data = {"sub": str(user.id), "email": user.email}
            access_token = create_access_token(token_data)
            new_refresh_token = create_refresh_token(token_data)

            return TokenResponse(
                access_token=access_token,
                refresh_token=new_refresh_token,
            )

        except HTTPException:
            raise

        except Exception as e:
            print("🔥 REFRESH ERROR:", str(e))
            raise HTTPException(
                status_code=500,
                detail=str(e)
            )