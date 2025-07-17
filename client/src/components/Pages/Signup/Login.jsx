// src/components/Login.js
import React, { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../firebase/confir';
import "../../css/Login.css";
import { useNavigate } from "react-router-dom";
import ForgotPasswordFlow from './ForgotPasswordFlow';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/table");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  if (showForgotPassword) {
    return (
      <ForgotPasswordFlow 
        onBack={() => setShowForgotPassword(false)}
        onResetSuccess={() => setShowForgotPassword(false)}
      />
    );
  }

  return (
    <div className="login-container">
      <form onSubmit={login} className="login-form">
        <h2 className="login-title">Welcome Back</h2>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errorMsg && <div className="error-msg">{errorMsg}</div>}

        <div className="forgot-password-link">
          <button 
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="forgot-password-btn"
          >
            Forgot Password?
          </button>
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </div>
  );
}