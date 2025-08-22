import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { Eye, EyeOff, Loader } from "lucide-react";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isAuthenticated } = useAuth();
  const { showNotification } = useApp();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const from = location.state?.from?.pathname || "/";

  // Watch for authentication changes
  useEffect(() => {
    console.log("Auth State Changed:", {
      user,
      isAuthenticated,
      from,
      currentPath: location.pathname,
    });

    // If user becomes authenticated, redirect
    if (isAuthenticated && user) {
      console.log("User authenticated, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [user, isAuthenticated, from, navigate, location]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log("1. Starting login...");
      const result = await login(formData);

      console.log("2. Login result:", result);
      console.log("3. Token in localStorage:", localStorage.getItem("token"));
      console.log("4. User in localStorage:", localStorage.getItem("user"));

      if (result.success) {
        showNotification("Login successful!", "success");
        console.log(
          "5. Login successful, user state will update and trigger redirect"
        );

        // The useEffect above will handle the redirect when user state updates
        // But we can also try direct navigation as backup
        setTimeout(() => {
          if (!isAuthenticated) {
            console.log("6. Fallback: Direct navigation to:", from);
            navigate(from, { replace: true });
          }
        }, 100);
      } else {
        console.error("Login failed:", result.error);
        showNotification(result.error || "Login failed", "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      showNotification("An error occurred. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Demo login function
  const handleDemoLogin = (role) => {
    const demoAccounts = {
      admin: { email: "admin@superadmin.com", password: "Admin@12345" },
      recruiter: { email: "recruiter@techcorp.com", password: "password123" },
      seeker: { email: "sarah@example.com", password: "password123" },
    };

    setFormData(demoAccounts[role]);
    showNotification("Demo credentials filled. Click Sign In!", "info");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <span>in</span>
          </Link>
          <h1>Sign in</h1>
          <p>Stay updated on your professional world</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? "error" : ""}`}
              disabled={loading}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? "error" : ""}`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <Link to="/forgot-password" className="forgot-password-link">
            Forgot password?
          </Link>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="spinner" size={20} />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="demo-accounts">
          <p className="demo-title">Try with demo account:</p>
          <div className="demo-buttons">
            <button
              onClick={() => handleDemoLogin("seeker")}
              className="btn btn-outline btn-small"
            >
              Job Seeker
            </button>
            <button
              onClick={() => handleDemoLogin("recruiter")}
              className="btn btn-outline btn-small"
            >
              Recruiter
            </button>
            <button
              onClick={() => handleDemoLogin("admin")}
              className="btn btn-outline btn-small"
            >
              Admin
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            New to LinkedIn?{" "}
            <Link to="/register" className="auth-link">
              Join now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
