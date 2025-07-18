import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../firebase/confir';
import '../../css/Login.css';

const ForgotPasswordFlow = ({ onBack, onResetSuccess }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
      setTimeout(() => {
        onResetSuccess();
      }, 2000);
    } catch (error) {
      setError('Failed to send reset email. Please check your email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleResetPassword} className="login-form">
        <h2 className="login-title">Reset Password</h2>
        
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        {error && <div className="error-msg">{error}</div>}
        {message && <div className="success-msg">{message}</div>}

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Email'}
        </button>

        <button 
          type="button" 
          onClick={onBack} 
          className="back-btn"
          disabled={loading}
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordFlow;
