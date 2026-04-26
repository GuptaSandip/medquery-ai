from datetime import datetime
from typing import Dict

from jose import jwt

from config import settings

# In-memory token denylist (dev / single-process only)
_DENYLIST: Dict[str, datetime] = {}


def revoke_token(token: str) -> None:
    """Add token to denylist until it naturally expires."""
    try:
        payload = jwt.get_unverified_claims(token)
        exp = payload.get("exp")

        if isinstance(exp, (int, float)):
            _DENYLIST[token] = datetime.utcfromtimestamp(exp)
            return

    except Exception:
        pass

    # Fallback expiration if exp missing
    _DENYLIST[token] = datetime.utcnow()


def is_token_revoked(token: str) -> bool:
    """Check if token is currently denied."""
    _cleanup_expired()
    return token in _DENYLIST


def _cleanup_expired() -> None:
    """Remove expired tokens from denylist."""
    now = datetime.utcnow()

    expired_tokens = [
        token for token, exp in _DENYLIST.items()
        if exp <= now
    ]

    for token in expired_tokens:
        _DENYLIST.pop(token, None)