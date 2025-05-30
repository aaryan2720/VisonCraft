import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import api from '../../../services/api';
import { useTranslation } from 'react-i18next';

// Import components
import BackButton from './components/BackButton/BackButton';
import ImageSection from './components/ImageSection/ImageSection';
import LogoSection from './components/LogoSection/LogoSection';
import LoginHeader from './components/LoginHeader/LoginHeader';
import EmailPhoneInput from './components/EmailPhoneInput/EmailPhoneInput';
import PasswordInput from './components/PasswordInput/PasswordInput';
import LoginButton from './components/LoginButton/LoginButton';
import ForgotPasswordLink from './components/ForgotPasswordLink/ForgotPasswordLink';
import Divider from './components/Divider/Divider';
import SocialButtons from './components/SocialButtons/SocialButtons';
import SignUpLink from './components/SignUpLink/SignUpLink';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });
  
  const [inputType, setInputType] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const navigate = useNavigate();
  const { t } = useTranslation();

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
    
    if (errors[name]) {
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
      
      if (rememberMe) {
        localStorage.setItem('token', response.data.token);
      } else {
        sessionStorage.setItem('token', response.data.token);
      }
      
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
  };

  return (
    <div className="login-container">
      <ImageSection />
      
      <div className="login-form-section">
        <div className="login-card">
        <BackButton />
          <LogoSection />
         
          <LoginHeader />
          
          {submitError && (
            <div className="alert alert-error">
              {submitError}
            </div>
          )}
          
          <form className="login-form" onSubmit={handleSubmit}>
         
            <EmailPhoneInput 
              value={formData.emailOrPhone}
              onChange={handleInputChange}
              inputType={inputType}
              error={errors.emailOrPhone}
              hasSubmitted={hasSubmitted}
            />
            
            <PasswordInput 
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              hasSubmitted={hasSubmitted}
            />
            
            <LoginButton 
              isFormValid={isFormValid}
              isSubmitting={isSubmitting}
            />
          </form>
          
          <ForgotPasswordLink />
          <Divider />
          <SocialButtons handleSocialLogin={handleSocialLogin} />
          <SignUpLink />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;