import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignupPage.css';
import api from '../../services/api'; // Import the axios instance

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
      const response = await api.post('/auth/register', {
        name: formData.name,
        emailOrPhone: formData.emailOrPhone,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      
      // Handle successful registration
      console.log('Registration successful:', response.data);
      
      // Store the token (you might want to use a more secure method)
      localStorage.setItem('token', response.data.token);
      
      // Redirect to dashboard or home page
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Registration error:', error.message);
      setSubmitError(error.message || 'Registration failed. Please try again.');
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
      <div className="signup-card">
        <div className="signup-header">
          <h1>Create Account</h1>
          <p>Join DocNish to access all our services</p>
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
              className={errors.name ? 'error' : ''}
              placeholder="Enter your full name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="emailOrPhone">
              Email / Phone Number
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
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
                placeholder="Create a password"
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
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? 'error' : ''}
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
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
          
          <button 
            type="submit" 
            className={`signup-button ${isFormValid && !isSubmitting ? 'enabled' : 'disabled'}`}
            disabled={!isFormValid || isSubmitting}
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
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;