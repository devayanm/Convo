import React, { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const history = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      localStorage.setItem("token", response.token); // Store token in localStorage
      history("/meetings"); // Redirect to meetings page after login
      window.location.reload(); // Reload the page to refresh the state
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold">Login to Convo</h2>
          <p className="text-muted">
            Enter your email and password to access your meetings.
          </p>
        </div>
        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-describedby="emailHelp"
              placeholder="Enter your email"
            />
            <div id="emailHelp" className="form-text">
              We will never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type={passwordVisible ? "text" : "password"}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-describedby="passwordHelp"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y"
              onClick={() => setPasswordVisible(!passwordVisible)}
              aria-label={passwordVisible ? "Hide password" : "Show password"}
            >
              <i
                className={`bi ${passwordVisible ? "bi-eye-slash" : "bi-eye"}`}
              ></i>
            </button>
            <div id="passwordHelp" className="form-text">
              Your password must be between 8 and 20 characters long.
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
            disabled={loading}
          >
            {loading && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                className="me-2"
              />
            )}
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="mb-0">
            Don't have an account?{" "}
            <a href="/register" className="text-primary">
              Sign up
            </a>
          </p>
          <p className="mb-0">
            Forgot your password?{" "}
            <a href="/forgot-password" className="text-primary">
              Reset it
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
