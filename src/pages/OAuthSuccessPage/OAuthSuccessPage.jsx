import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { refreshAccessToken } from "../../store/authSlice";

const OAuthSuccessPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const completeGoogleLogin = async () => {
      try {
        await dispatch(refreshAccessToken()).unwrap();

        navigate("/", { replace: true });
      } catch (error) {
        console.error("Google login completion failed:", error);
        navigate("/auth", {
          replace: true,
          state: {
            error: "Google login failed. Please try again.",
          },
        });
      }
    };

    completeGoogleLogin();
  }, [dispatch, navigate]);

  return (
    <div className="oauth-success-page">
      <div className="oauth-success-card">
        <h2>Signing you in...</h2>
        <p>Please wait while we complete your Google login.</p>
      </div>
    </div>
  );
};

export default OAuthSuccessPage;