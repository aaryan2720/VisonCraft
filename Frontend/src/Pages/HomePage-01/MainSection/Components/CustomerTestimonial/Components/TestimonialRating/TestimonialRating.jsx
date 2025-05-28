// src/components/CustomerTestimonial/TestimonialRating/TestimonialRating.jsx
import React from 'react';
import './TestimonialRating.css';

const TestimonialRating = ({ rating }) => {
  return (
    <div className="testimonial-rating">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
      ))}
    </div>
  );
};

export default TestimonialRating;