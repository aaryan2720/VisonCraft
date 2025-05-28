import React, { useState } from 'react';
import './ServiceCard.css';
import ApplyButton from '../ApplyButton/ApplyButton';
import { Link } from 'react-router-dom';
const ServiceCard = ({ service }) => {
  const [showDocuments, setShowDocuments] = useState(false);

  const handlePopupClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="service-card">
      <div className="service-logo">{service.logo}</div>
      <h3 className="service-title">{service.displayName}</h3>
      <p className="service-subscript">Consultancy Service</p>
      <div className="service-details">
        <div className="detail-item">
          <span className="detail-label">Fees:</span>
          <span className="detail-value">{service.fees}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Time Required:</span>
          <span className="detail-value">{service.timeRequired}</span>
        </div>
      </div>
      <button 
        className="documents-button"
        onClick={() => setShowDocuments(true)}
      >
        Required Documents
      </button>
      <p className="service-description">{service.description}</p>
      <ApplyButton to={`/apply/${service.id}`} />

      
      {showDocuments && (
        <div 
          className="documents-popup" 
          onClick={() => setShowDocuments(false)}
        >
          <div className="popup-content" onClick={handlePopupClick}>
            <button 
              className="close-popup"
              onClick={() => setShowDocuments(false)}
            >
              &times;
            </button>
            <h3>Required Documents for {service.displayName}</h3>
            <ul className="documents-list">
              {service.requiredDocuments.map((doc, index) => (
                <li key={index}>{doc}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;