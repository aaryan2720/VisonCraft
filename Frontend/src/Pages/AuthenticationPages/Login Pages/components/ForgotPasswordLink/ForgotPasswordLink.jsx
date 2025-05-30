import React from 'react';
import { Link } from 'react-router-dom';
import './ForgotPasswordLink.css';

const ForgotPasswordLink = () => {
  return (
    <div className="forgot-password-section">
      <Link to="/forgot-password" className="forgot-password-link">
        Forgot your password?
      </Link>
    </div>
  );
};

export default ForgotPasswordLink;