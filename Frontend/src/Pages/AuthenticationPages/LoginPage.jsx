import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import api from '../../services/api'; // Import the axios instance
import { useTranslation } from 'react-i18next';

// Import icons
import { FcGoogle } from 'react-icons/fc';
import { BsApple, BsMicrosoft } from 'react-icons/bs';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });
  
  const [inputType, setInputType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  // Validate form on data change
  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
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
    }
    
    setErrors(newErrors);
    setIsFormValid(isValid);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setHasSubmitted(true);
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await api.post('/auth/login', {
        emailOrPhone: formData.emailOrPhone,
        password: formData.password,
        rememberMe: rememberMe
      });
      
      // Handle successful login
      console.log('Login successful:', response.data);
      
      // Store the token
      if (rememberMe) {
        localStorage.setItem('token', response.data.token);
      } else {
        sessionStorage.setItem('token', response.data.token);
      }
      
      // Redirect to dashboard or home page
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      setSubmitError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
    // Implement social login logic
  };

  return (
    <div className="login-container">
      {/* Left Image Section */}
      <div className="login-image-section">
        <div className="image-overlay">
          <div>
            <img src="" alt="" />
          <h2>Welcome to Docnish</h2>
          <p>Your trusted healthcare companion</p>
          </div>
        </div>
      </div>
      
      {/* Right Form Section */}
      <div className="login-form-section">
        <div className="login-card">
          {/* Docnish Logo */}
          <div className="logo-section">
            <div className="logo">
              <span>DOCNISH</span>
            </div>
          </div>
          
          {/* Sign In Heading */}
          <div className="login-header">
            <h1>Sign In</h1>
          </div>
          
          {submitError && (
            <div className="alert alert-error">
              {submitError}
            </div>
          )}
          
          <form className="login-form" onSubmit={handleSubmit}>
            {/* Email or Phone Number Field */}
            <div className="form-group">
              <label htmlFor="emailOrPhone">
                Email or Phone Number
                {inputType && <span className="input-type">({inputType})</span>}
              </label>
              <input
                type="text"
                id="emailOrPhone"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleInputChange}
                className={errors.emailOrPhone && hasSubmitted ? 'error' : ''}
                placeholder="Enter your email or phone number"
              />
              {errors.emailOrPhone && hasSubmitted && <span className="error-message">{errors.emailOrPhone}</span>}
            </div>
            
            {/* Password Field with Eye Icon */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`password-input ${errors.password && hasSubmitted ? 'error' : ''}`}
                  placeholder="Enter your password"
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
              {errors.password && hasSubmitted && <span className="error-message">{errors.password}</span>}
            </div>
            
         
            
            
            {/* Sign In Button */}
            <button 
              type="submit" 
              className={`login-button ${isFormValid && !isSubmitting ? 'enabled' : 'disabled'}`}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          {/* Forgot Password */}
          <div className="forgot-password-section">
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot your password?
            </Link>
          </div>
          
          <div className="divider">
            <span>or continue with</span>
          </div>
          
          {/* Social Login Buttons */}
          <div className="social-login">
            <button 
              className="social-button google"
              onClick={() => handleSocialLogin('Google')}
            >
              <FcGoogle />
              <span>Google</span>
            </button>
            
            <button 
              className="social-button microsoft"
              onClick={() => handleSocialLogin('Microsoft')}
            >
              <BsMicrosoft />
              <span>Microsoft</span>
            </button>
            
            <button 
              className="social-button apple"
              onClick={() => handleSocialLogin('Apple')}
            >
              <BsApple />
              <span>Apple</span>
            </button>
          </div>
          
          {/* Sign Up Link */}
          <div className="signup-link">
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;