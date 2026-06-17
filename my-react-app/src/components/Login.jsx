
// src/components/Login.js
import React, { useState } from 'react';
import authService from './services/authService';
import { useAuth } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';
// import { FaUser, FaLock } from 'react-icons/fa';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import '../App.css'; // Create and import a CSS file for styling
import SessionNavbar from './SessionNavbar';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsSubmitting(true);
    authService.login(username, password)
      .then(response => {
        login(response);
        var user_name = localStorage.getItem('username');
        <SessionNavbar  user={user_name}  />
        navigate("/");
      })
      .catch(error => {
        console.log("logout successfully");
        // toast.error('Login failed');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-card__brand">
          <img
            className="login-card__logo"
            src={`${process.env.REACT_APP_BASE_URL}/uploads/logo.png`}
            alt="Sir Syed Educational Institutes"
          />
          <h2 className="login-card__brand-title">
            Sir Syed <br /> Educational Institutes
          </h2>
          <p className="login-card__brand-tagline">
            ERP Campus Management System
          </p>
        </div>

        <div className="login-card__form">
          <div className="login-card__form-inner">
            <h3 className="login-card__title">Welcome back</h3>
            <p className="login-card__subtitle">
              Please sign in to continue to your dashboard.
            </p>

            <label className="login-field">
              <span className="login-field__label">Username</span>
              <div className="login-field__input-wrap">
                <i className="fa fa-user login-field__icon" aria-hidden="true"></i>
                <input
                  className="login-field__input"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="username"
                />
              </div>
            </label>

            <label className="login-field">
              <span className="login-field__label">Password</span>
              <div className="login-field__input-wrap">
                <i className="fa fa-lock login-field__icon" aria-hidden="true"></i>
                <input
                  className="login-field__input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-field__toggle"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true"></i>
                </button>
              </div>
            </label>

            <button
              type="button"
              onClick={handleLogin}
              className="login-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in…' : 'LOGIN'}
            </button>

            {/* <div className="login-card__extras">
              <Link to="/register-sses-user" className="login-card__link">
                Create an account
              </Link>
            </div> */}

            <p className="login-card__copyright">
              ©2025 ERP Campus Management System <br />
              <span>DEVELOPED BY SSES (IT)</span>
            </p>
          </div>
        </div>
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default Login;
