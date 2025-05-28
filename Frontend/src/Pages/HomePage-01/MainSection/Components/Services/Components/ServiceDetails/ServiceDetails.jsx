// src/components/Services/ServiceDetails/ServiceDetails.jsx
import React from 'react';
import './ServiceDetails.css';
import DetailItem from '../DetailItem/DetailItem';
import { useTranslation } from 'react-i18next';

const ServiceDetails = ({ fees, timeRequired }) => {
  const { t } = useTranslation();
  
  return (
    <div className="service-details">
      <DetailItem label={t('services.fees')} value={fees} />
      <DetailItem label={t('services.timeRequired')} value={timeRequired} />
    </div>
  );
};

export default ServiceDetails;