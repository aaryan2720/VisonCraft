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
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
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
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await api.post('/auth/login', {
        emailOrPhone: formData.emailOrPhone,
        password: formData.password
      });
      
      // Handle successful login
      console.log('Login successful:', response.data);
      
      // Store the token
      localStorage.setItem('token', response.data.token);
      
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
      <div className="login-card">
        <div className="login-header">
          <h1>{t('auth.welcomeBack')}</h1>
          <p>{t('auth.loginText')}</p>
        </div>
        
        {submitError && (
          <div className="alert alert-error">
            {submitError}
          </div>
        )}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="emailOrPhone">
              {t('auth.emailPhone')}
              {inputType && <span className="input-type">Detected as: {inputType}</span>}
            </label>
            <input
              type="text"
              id="emailOrPhone"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleInputChange}
              className={errors.emailOrPhone ? 'error' : ''}
              placeholder="Enter your email or phone number"
            />
            {errors.emailOrPhone && <span className="error-message">{errors.emailOrPhone}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              {t('auth.password')}
              <Link to="/forgot-password" className="forgot-password">{t('auth.forgotPassword')}</Link>
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`password-input ${errors.password ? 'error' : ''}`}
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
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <button 
            type="submit" 
            className={`login-button ${isFormValid && !isSubmitting ? 'enabled' : 'disabled'}`}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? 'Logging In...' : t('auth.loginButton')}
          </button>
        </form>
        
        <div className="divider">
          <span>{t('auth.orContinueWith')}</span>
        </div>
        
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
        
        <div className="signup-link">
          <p>{t('auth.dontHaveAccount')} <Link to="/signup">{t('auth.signupButton')}</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;