// src/components/Services/ApplyButton/ApplyButton.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './ApplyButton.css';
import { useTranslation } from 'react-i18next';

const ApplyButton = ({ to }) => {
  const { t } = useTranslation();
  
  return (
    <Link to={to} className="apply-button">
      {t('services.applyNow')}
    </Link>
  );
};

export default ApplyButton;