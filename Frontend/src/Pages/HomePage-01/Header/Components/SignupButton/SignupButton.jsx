import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './SignupButton.css';

const SignupButton = () => {
  const { t } = useTranslation();
  
  return (
    <Link to="/signup" className="signup-button">{t('navbar.signup')}</Link>
  );
};

export default SignupButton;