import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import Loader from "../../components/ui/Loader";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const access_token = searchParams.get("access_token");
    const refresh_token = searchParams.get("refresh_token");

    if (access_token && refresh_token) {
      login({ access_token, refresh_token })
        .then(() => navigate("/dashboard"))
        .catch(() => navigate("/login?error=google_failed"));
    } else {
      navigate("/login?error=google_failed");
    }
  }, [login, navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader text="Completing Google sign in..." />
    </div>
  );
}
