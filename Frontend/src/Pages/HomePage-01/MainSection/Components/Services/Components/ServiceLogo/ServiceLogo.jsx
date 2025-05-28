// src/components/Services/ServiceLogo/ServiceLogo.jsx
import React from 'react';
import './ServiceLogo.css';

const ServiceLogo = ({ logo }) => {
  return (
    <div className="service-logo">
      <span className="service-icon">{logo}</span>
    </div>
  );
};

export default ServiceLogo;