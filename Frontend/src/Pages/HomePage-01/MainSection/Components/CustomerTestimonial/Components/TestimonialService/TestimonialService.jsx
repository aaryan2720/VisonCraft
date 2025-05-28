// src/components/CustomerTestimonial/TestimonialService/TestimonialService.jsx
import React from 'react';
import './TestimonialService.css';
import { useTranslation } from 'react-i18next';

const TestimonialService = ({ service }) => {
  const { t } = useTranslation();
  
  return (
    <div className="testimonial-service">
      <span>{t('testimonials.service')}: </span>
      {t(`services.serviceNames.${service}`)}
    </div>
  );
};

export default TestimonialService;