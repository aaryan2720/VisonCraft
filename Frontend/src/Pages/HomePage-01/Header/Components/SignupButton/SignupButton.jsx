import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './SignupButton.css';

const SignupButton = () => {
  const { t } = useTranslation();
  
  return (
    <a href="/signup" className="signup-button" title="Sign Up">
      <i className="fas fa-user-plus"></i>
      <span className="button-text">Sign Up</span>
    </a>
  );
};

export default SignupButton;