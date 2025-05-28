// src/components/CustomerTestimonial/UserImage/UserImage.jsx
import React from 'react';
import './UserImage.css';

const UserImage = ({ src, alt }) => {
  return (
    <div className="user-image">
      <img src={src} alt={alt} />
    </div>
  );
};

export default UserImage;