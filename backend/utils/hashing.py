from passlib.context import CryptContext

# Preferred scheme first (used for new hashes)
pwd_context = CryptContext(
    schemes=["pbkdf2_sha256", "bcrypt"],
    deprecated="auto"
)


def hash_password(password: str) -> str:
    """Hash a plain password"""
    if not password:
        raise ValueError("Password cannot be empty")   # ✅ safety check
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against hashed"""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False   # ✅ prevents crash on corrupted hash