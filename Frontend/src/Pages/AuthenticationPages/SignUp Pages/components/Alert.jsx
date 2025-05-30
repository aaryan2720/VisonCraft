// src/components/signup/Alert.jsx
import React from 'react';

const Alert = ({ type, message }) => (
  <div className={`alert alert-${type}`}>
    {type === 'success' ? (
      <span className="success-icon">✓</span>
    ) : (
      <span>⚠</span>
    )}
    {message}
  </div>
);

export default Alert;