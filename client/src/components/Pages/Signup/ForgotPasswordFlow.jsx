// src/components/ForgotPasswordFlow.js
import React, { useState } from 'react';
import { 
  Mail, Lock, ArrowLeft, CheckCircle, AlertCircle, Loader2
} from 'lucide-react';
import { 
  getAuth, 
  sendPasswordResetEmail
} from "firebase/auth";
import '../../css/ForgotPasswordFlow.css';

const ForgotPasswordFlow = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSent, setIsSent] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendResetLink = async () => {
    setErrors({});
    if (!email) return setErrors({ email: 'Email is required' });
    if (!validateEmail(email)) return setErrors({ email: 'Enter valid email' });

    setIsLoading(true);
    try {
      const auth = getAuth();
      
      // Always send reset email without checking existence first
      await sendPasswordResetEmail(auth, email);
      
      setIsSent(true);
      setCurrentStep(2);
    } catch (error) {
      console.error('Password reset error:', error);
      
      let errorMessage = 'Failed to send reset link. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'If this email is registered, you will receive a reset link';
        setIsSent(true); // Pretend it was sent for security
        setCurrentStep(2);
      }
      else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      } 
      else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format';
      }
      
      setErrors({ email: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <div className="forgot-top-border"></div>

        {/* Step 1: Email Input */}
        {currentStep === 1 && (
          <div className="step">
            <div className="icon-circle purple"><Lock size={24} /></div>
            <h2>Forgot Password?</h2>
            <p>Enter your email to receive a password reset link</p>
            
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon">
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  placeholder="your@email.com"
                  className={errors.email ? 'input-error' : ''}
                />
                <Mail size={18} />
              </div>
              {errors.email && (
                <p className="error-msg">
                  <AlertCircle size={14} /> {errors.email}
                </p>
              )}
            </div>
            
            <button 
              onClick={handleSendResetLink} 
              disabled={isLoading}
              className={`btn ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="spinner" size={18} /> Sending...
                </>
              ) : 'Send Reset Link'}
            </button>
            
            <button onClick={onBack} className="link-btn back-btn">
              <ArrowLeft size={16} /> Back to Login
            </button>
          </div>
        )}

        {/* Step 2: Success Message */}
        {currentStep === 2 && (
          <div className="step success-step">
            <div className="icon-circle green big">
              <CheckCircle size={36} />
            </div>
            <h2>Reset Link Sent!</h2>
            
            {isSent ? (
              <>
                <p>If your email is registered, you'll receive a password reset link at:</p>
                <p className="user-email">{email}</p>
                <p className="instructions">
                  Check your inbox and follow the instructions to reset your password.
                </p>
              </>
            ) : (
              <p className="instructions">
                If your email is registered, you'll receive a password reset link shortly.
              </p>
            )}
            
            <div className="success-note">
              <AlertCircle size={18} />
              <span>Didn't receive the email?</span>
              <ul>
                <li>Check your spam or junk folder</li>
                <li>Verify you entered the correct email address</li>
                <li>Wait a few minutes - emails can sometimes be delayed</li>
                <li>Try again later if you've made multiple requests</li>
              </ul>
            </div>
            
            <button 
              onClick={handleSendResetLink} 
              disabled={isLoading}
              className={`btn ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="spinner" size={18} /> Resending...
                </>
              ) : 'Resend Link'}
            </button>
            
            <button onClick={() => setCurrentStep(1)} className="link-btn back-btn">
              <ArrowLeft size={16} /> Change Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordFlow;