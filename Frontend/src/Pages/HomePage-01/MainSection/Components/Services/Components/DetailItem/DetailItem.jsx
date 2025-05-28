// src/components/Services/DetailItem/DetailItem.jsx
import React from 'react';
import './DetailItem.css';

const DetailItem = ({ label, value }) => {
  return (
    <div className="detail-item">
      <span className="detail-label">{label}:</span>
      <span className="detail-value">{value}</span>
    </div>
  );
};

export default DetailItem;