import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignupPage.css';
import api from '../../services/api';

// Import icons
import { FcGoogle } from 'react-icons/fc';
import { BsApple, BsMicrosoft } from 'react-icons/bs';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [inputType, setInputType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  
  const navigate = useNavigate();

  // Detect input type (email or phone)
  useEffect(() => {
    const value = formData.emailOrPhone;
    if (value) {
      if (value.includes('@')) {
        setInputType('email');
      } else if (/^\d+$/.test(value)) {
        setInputType('phone');
      } else {
        setInputType('');
      }
    } else {
      setInputType('');
    }
  }, [formData.emailOrPhone]);

  // Validate form on data change (but only show errors after submit attempt)
  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types (only if they've attempted to submit)
    if (errors[name] && hasAttemptedSubmit) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Clear submit error when user makes changes
    if (submitError) {
      setSubmitError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    // Validate email/phone
    if (!formData.emailOrPhone) {
      newErrors.emailOrPhone = 'Email or phone number is required';
      isValid = false;
    } else if (inputType === 'email' && !/\S+@\S+\.\S+/.test(formData.emailOrPhone)) {
      newErrors.emailOrPhone = 'Please enter a valid email address';
      isValid = false;
    } else if (inputType === 'phone' && !/^\d{10}$/.test(formData.emailOrPhone)) {
      newErrors.emailOrPhone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }
    
    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    // Only set errors if user has attempted to submit
    if (hasAttemptedSubmit) {
      setErrors(newErrors);
    }
    
    setIsFormValid(isValid);
    return isValid;
  };

  const handleSendOTP = async () => {
    if (!formData.emailOrPhone) {
      setOtpError('Email or phone number is required');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      await api.post('/otp/send-otp', { emailOrPhone: formData.emailOrPhone });
      setOtpSent(true);
    } catch (error) {
      setOtpError(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setOtpError('OTP is required');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      await api.post('/otp/verify-otp', { 
        emailOrPhone: formData.emailOrPhone, 
        otp 
      });
      setOtpVerified(true);
    } catch (error) {
      setOtpError(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    setSubmitError('');
    
    if (!validateForm()) return;
    
    if (!otpVerified) {
      setSubmitError('Please verify your email/phone with OTP first');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await api.post('/auth/register', {
        name: formData.name,
        emailOrPhone: formData.emailOrPhone,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      
      // Handle successful registration
      console.log('Registration successful:', response.data);
      
      // Store the token
      localStorage.setItem('token', response.data.token);
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Registration error:', error.message);
      setSubmitError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignup = (provider) => {
    console.log(`Signing up with ${provider}`);
    // Implement social signup logic
  };

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        {/* Left side - Image */}
        <div className="signup-image-section">
          <div className="image-container">
            <img 
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Medical professionals" 
              className="signup-image"
            />
            <div className="image-overlay">
              <div className="overlay-content">
                <h2>Join DocNish Today</h2>
                <p>Connect with healthcare professionals and access quality medical services from the comfort of your home.</p>
                <div className="features-list">
                  <div className="feature-item">
                    <span className="checkmark">✓</span>
                    <span>24/7 Medical Support</span>
                  </div>
                  <div className="feature-item">
                    <span className="checkmark">✓</span>
                    <span>Verified Healthcare Providers</span>
                  </div>
                  <div className="feature-item">
                    <span className="checkmark">✓</span>
                    <span>Secure & Confidential</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="signup-form-section">
          <div className="signup-card">
            <div className="signup-header">
              <h1>Create Your Account</h1>
              <p>Start your healthcare journey with DocNish</p>
            </div>
            
            {submitError && (
              <div className="alert alert-error">
                {submitError}
              </div>
            )}
            
            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={hasAttemptedSubmit && errors.name ? 'error' : ''}
                  placeholder="Enter your full name"
                />
                {hasAttemptedSubmit && errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="emailOrPhone">
                  Email / Phone Number
                  {inputType && <span className="input-type">({inputType === 'email' ? 'Email' : 'Phone'})</span>}
                </label>
                <div className="email-phone-container">
                  <input
                    type="text"
                    id="emailOrPhone"
                    name="emailOrPhone"
                    value={formData.emailOrPhone}
                    onChange={handleInputChange}
                    className={hasAttemptedSubmit && errors.emailOrPhone ? 'error' : ''}
                    placeholder="Enter your email or phone number"
                    disabled={otpSent && !otpVerified}
                  />
                  {!otpSent ? (
                    <button
                      type="button"
                      className="otp-button"
                      onClick={handleSendOTP}
                      disabled={!formData.emailOrPhone || otpLoading}
                    >
                      {otpLoading ? 'Sending...' : 'Send OTP'}
                    </button>
                  ) : null}
                </div>
                {hasAttemptedSubmit && errors.emailOrPhone && <span className="error-message">{errors.emailOrPhone}</span>}
              </div>
              
              {otpSent && !otpVerified && (
                <div className="form-group">
                  <label htmlFor="otp">Verification Code</label>
                  <div className="otp-container">
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                    />
                    <button
                      type="button"
                      className="verify-button"
                      onClick={handleVerifyOTP}
                      disabled={!otp || otpLoading}
                    >
                      {otpLoading ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                  {otpError && <span className="error-message">{otpError}</span>}
                </div>
              )}
              
              {otpVerified && (
                <div className="alert alert-success">
                  <span className="success-icon">✓</span>
                  {inputType === 'email' ? 'Email' : 'Phone number'} verified successfully!
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={hasAttemptedSubmit && errors.password ? 'error' : ''}
                    placeholder="Create a strong password"
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </button>
                </div>
                {hasAttemptedSubmit && errors.password && <span className="error-message">{errors.password}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={hasAttemptedSubmit && errors.confirmPassword ? 'error' : ''}
                    placeholder="Confirm your password"
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </button>
                </div>
                {hasAttemptedSubmit && errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
              
              <button 
                type="submit" 
                className={`signup-button ${isFormValid && !isSubmitting && otpVerified ? 'enabled' : 'disabled'}`}
                disabled={!isFormValid || isSubmitting || !otpVerified}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
            
            <div className="divider">
              <span>or continue with</span>
            </div>
            
            <div className="social-signup">
              <button 
                className="social-button google"
                onClick={() => handleSocialSignup('Google')}
              >
                <FcGoogle />
                <span>Google</span>
              </button>
              
              <button 
                className="social-button microsoft"
                onClick={() => handleSocialSignup('Microsoft')}
              >
                <BsMicrosoft />
                <span>Microsoft</span>
              </button>
              
              <button 
                className="social-button apple"
                onClick={() => handleSocialSignup('Apple')}
              >
                <BsApple />
                <span>Apple</span>
              </button>
            </div>
            
            <div className="login-link">
              Already have an account? <Link to="/login">Sign in here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;