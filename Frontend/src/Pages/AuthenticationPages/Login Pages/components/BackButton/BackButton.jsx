import React from 'react';
import { Link } from 'react-router-dom';
import './BackButton.css';

const BackButton = () => {
  return (
    <div className="back-button-container">
      <Link to="/" className="back-button">
        &larr; Back to Home
      </Link>
    </div>
  );
};

export default BackButton;