// src/components/CustomerTestimonial/TestimonialCard/TestimonialCard.jsx
import React from 'react';
import './TestimonialCard.css';
import TestimonialHeader from '../TestimonialHeader/TestimonialHeader';
import TestimonialRating from '../TestimonialRating/TestimonialRating';
import TestimonialService from '../TestimonialService/TestimonialService';
import { useTranslation } from 'react-i18next';

// src/components/CustomerTestimonial/TestimonialCard/TestimonialCard.jsx
const TestimonialCard = ({ testimonial }) => {
    const { t } = useTranslation();
    
    return (
      <div className="testimonial-card">
        <TestimonialHeader 
          name={testimonial.name} 
          image={testimonial.image} 
          daysAgo={testimonial.daysAgo} 
        />
        <TestimonialRating rating={testimonial.rating} />
        <TestimonialService service={testimonial.service} />
        <p className="testimonial-feedback">
          {t(`${testimonial.feedback}`)}
        </p>
      </div>
    );
  };

  export default TestimonialCard;