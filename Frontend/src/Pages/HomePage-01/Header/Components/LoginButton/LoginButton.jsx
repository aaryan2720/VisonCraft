import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './LoginButton.css';

const LoginButton = () => {
  const { t } = useTranslation();
  
  return (
    <a href="/login" className="login-button" title="Login">
      <i className="fas fa-user"></i>
      <span className="button-text">Login</span>
    </a>
  );
};

export default LoginButton;