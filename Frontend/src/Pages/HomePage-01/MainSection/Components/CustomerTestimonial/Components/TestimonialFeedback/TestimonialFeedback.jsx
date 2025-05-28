import React from 'react';
import { useTranslation } from 'react-i18next';
import './TestimonialFeedback.css';

const TestimonialFeedback = ({ feedbackKey }) => {
  const { t } = useTranslation();
  
  return (
    <p className="testimonial-feedback">
      {t(`testimonials.feedback.${feedbackKey}`)}
    </p>
  );
};

export default TestimonialFeedback;