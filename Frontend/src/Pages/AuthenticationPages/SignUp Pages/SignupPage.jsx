// src/components/signup/SignupForm.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import SignupImageSection from './components/SignupImageSection';
import FormGroup from './components/FormGroup';
import PasswordInput from './components/PasswordInput';
import EmailPhoneInput from './components/EmailPhoneInput';
import OTPVerification from './components/OTPVerification';
import SocialSignupButtons from './components/SocialSignupButtons';
import SignupButton from './components/SignupButton';
import Alert from './components/Alert';
import './SignupPage.css';
import { IoArrowBack } from "react-icons/io5";

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

  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name] && hasAttemptedSubmit) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    if (submitError) {
      setSubmitError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
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
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
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
      
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
      
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignup = (provider) => {
    console.log(`Signing up with ${provider}`);
  };
  const handleBackClick = () => {
    navigate('/'); // Navigate to home page
  };

  
  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <SignupImageSection />
        
        
        <div className="signup-form-section">
        <button 
            className="back-button"
            onClick={handleBackClick}
            aria-label="Go back to home page"
          >
            <IoArrowBack />
          </button>
          <div className="signup-card">
            <div className="signup-header">
              <h1>Create Your Account</h1>
              <p>Start your  journey with DocNish</p>
            </div>
            
            {submitError && <Alert type="error" message={submitError} />}
            
            <form className="signup-form" onSubmit={handleSubmit}>
              <FormGroup
                label="Full Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={hasAttemptedSubmit ? errors.name : ''}
                placeholder="Enter your full name"
              />
              
              <EmailPhoneInput
                inputType={inputType}
                value={formData.emailOrPhone}
                onChange={handleInputChange}
                error={hasAttemptedSubmit ? errors.emailOrPhone : ''}
                otpSent={otpSent}
                otpVerified={otpVerified}
                otpLoading={otpLoading}
                onSendOTP={handleSendOTP}
              />
              
              {otpSent && !otpVerified && (
                <OTPVerification
                  otp={otp}
                  setOtp={setOtp}
                  otpLoading={otpLoading}
                  otpError={otpError}
                  onVerifyOTP={handleVerifyOTP}
                />
              )}
              
              {otpVerified && (
                <Alert 
                  type="success" 
                  message={`${inputType === 'email' ? 'Email' : 'Phone number'} verified successfully!`} 
                />
              )}
              
              <PasswordInput
                label="Password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                error={hasAttemptedSubmit ? errors.password : ''}
                placeholder="Create a strong password"
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
              
              <PasswordInput
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={hasAttemptedSubmit ? errors.confirmPassword : ''}
                placeholder="Confirm your password"
                showPassword={showConfirmPassword}
                setShowPassword={setShowConfirmPassword}
              />
              
              <SignupButton 
                isFormValid={isFormValid}
                isSubmitting={isSubmitting}
                otpVerified={otpVerified}
              />
            </form>
            
            <div className="divider">
              <span>or continue with</span>
            </div>
            
            <SocialSignupButtons onSocialSignup={handleSocialSignup} />
            
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