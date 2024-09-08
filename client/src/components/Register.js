import React, { useState } from 'react';
import { registerUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const history = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await registerUser({ name, email, password });
      history('/login');
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold">Register</h2>
          <p className="text-muted">Create an account to start using Convo.</p>
        </div>
        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              id="name"
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type={passwordVisible ? 'text' : 'password'}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y"
              onClick={() => setPasswordVisible(!passwordVisible)}
              aria-label={passwordVisible ? 'Hide password' : 'Show password'}
            >
              <i className={`bi ${passwordVisible ? 'bi-eye-slash' : 'bi-eye'}`}></i>
            </button>
          </div>
          <div className="mb-3 position-relative">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              id="confirmPassword"
              type={confirmPasswordVisible ? 'text' : 'password'}
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
            />
            <button
              type="button"
              className="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              aria-label={confirmPasswordVisible ? 'Hide password' : 'Show password'}
            >
              <i className={`bi ${confirmPasswordVisible ? 'bi-eye-slash' : 'bi-eye'}`}></i>
            </button>
          </div>
          <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center" disabled={loading}>
            {loading && <Spinner as="span" animation="border" size="sm" className="me-2" />}
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="mb-0">Already have an account? <a href="/login" className="text-primary">Log in</a></p>
          <p className="mb-0">By registering, you agree to our <a href="/terms" className="text-primary">Terms of Service</a> and <a href="/privacy" className="text-primary">Privacy Policy</a>.</p>
        </div>
      </div>
    </div>
  );
}

export default Register;
