import React, { useState, useRef, useEffect } from 'react';
import './TestimonialCard.css';

import TestimonialHeader from '../TestimonialHeader/TestimonialHeader';
import TestimonialRating from '../TestimonialRating/TestimonialRating';
import { useTranslation } from 'react-i18next';

const TestimonialCard = ({ testimonial }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncate, setNeedsTruncate] = useState(false);
  const feedbackRef = useRef(null);

  useEffect(() => {
    const el = feedbackRef.current;
    if (el) {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      const maxHeight = lineHeight * 3; 
      if (el.scrollHeight > maxHeight + 1) {
        setNeedsTruncate(true);
      }
    }
  }, []);

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <div className="testimonial-card">
      <div className="testimonial-card-header">
        <TestimonialHeader
          name={testimonial.name}
          image={testimonial.image}
          daysAgo={testimonial.daysAgo}
        />
        <TestimonialRating rating={testimonial.rating} />
      </div>

      <div className="testimonial-service-wrapper">
        <div className="testimonial-service">
          {t(`services.${testimonial.service}`)}
        </div>
      </div>

      <div className="testimonial-feedback-wrapper">
        <p
          ref={feedbackRef}
          className={`testimonial-feedback-text ${
            isExpanded ? 'expanded' : 'clamped'
          }`}
        >
          {t(`${testimonial.feedback}`)}
        </p>

        {needsTruncate && (
          <button className="view-more-btn" onClick={toggleExpand}>
            {isExpanded ? t('View Less') : t('View More')}
          </button>
        )}
      </div>
    </div>
  );
};

export default TestimonialCard;
