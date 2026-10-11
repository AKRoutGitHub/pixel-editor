import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { clearAuthError, registerUser, loginUser } from "../../store/authSlice";

function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, registrationMessage, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    about: "",
  });

  const isLogin = mode === "login";

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (registrationMessage) {
      setMode("login");
      setFormData((previous) => ({
        ...previous,
        password: "",
      }));
    }
  }, [registrationMessage]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error || registrationMessage) {
      dispatch(clearAuthError());
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setShowPassword(false);
    dispatch(clearAuthError());
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isLogin) {
      dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
        }),
      );

      return;
    }

    dispatch(registerUser(formData));
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/users/auth/google`;
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-back">
          <ArrowLeft size={16} />
          Back to Pixel Studio
        </Link>

        <div className="auth-header">
          <div className="auth-logo">
            <div className="auth-logo-pixel blue" />
            <div className="auth-logo-pixel purple" />
            <div className="auth-logo-pixel green" />
            <div className="auth-logo-pixel orange" />
          </div>

          <h1>Pixel Studio</h1>

          <p>
            {isLogin
              ? "Welcome back! Sign in to continue."
              : "Create an account and start creating."}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={isLogin ? "active" : ""}
            onClick={() => switchMode("login")}
          >
            <LogIn size={16} />
            Login
          </button>

          <button
            type="button"
            className={!isLogin ? "active" : ""}
            onClick={() => switchMode("signup")}
          >
            <UserPlus size={16} />
            Sign Up
          </button>
        </div>

        {error && <div className="auth-message auth-error">{error}</div>}

        {registrationMessage && !isLogin && (
          <div className="auth-message auth-success">{registrationMessage}</div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Name</label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="password-input-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="about">About</label>

              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Tell us something about yourself"
              />
            </div>
          )}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              "Please wait..."
            ) : isLogin ? (
              <>
                <LogIn size={17} />
                Login
              </>
            ) : (
              <>
                <UserPlus size={17} />
                Create Account
              </>
            )}
          </button>
          <button
            type="button"
            className="google-auth-button"
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <button
            type="button"
            onClick={() => switchMode(isLogin ? "signup" : "login")}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
