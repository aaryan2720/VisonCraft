// src/components/CustomerTestimonial/TestimonialHeader/TestimonialHeader.jsx
import React from 'react';
import './TestimonialHeader.css';
import UserImage from '../UserImage/UserImage';
import UserInfo from '../UserInfo/UserInfo';

const TestimonialHeader = ({ name, image, daysAgo }) => {
  return (
    <div className="testimonial-header">
      <div className="testimonial-user">
        <UserImage src={image} alt={name} />
        <UserInfo name={name} daysAgo={daysAgo} />
      </div>
    </div>
  );
};

export default TestimonialHeader;