// src/components/CustomerTestimonial/UserInfo/UserInfo.jsx
import React from 'react';
import './UserInfo.css';
import { useTranslation } from 'react-i18next';

const UserInfo = ({ name, daysAgo }) => {
  const { t } = useTranslation();
  
  return (
    <div className="user-info">
      <h4 className="user-name">{name}</h4>
      <p className="days-ago">{daysAgo} {t('testimonials.daysAgo')}</p>
    </div>
  );
};

export default UserInfo;