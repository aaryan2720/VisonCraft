import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './LoginButton.css';

const LoginButton = () => {
  const { t } = useTranslation();
  
  return (
    <Link to="/login" className="login-button">{t('navbar.login')}</Link>
  );
};

export default LoginButton;