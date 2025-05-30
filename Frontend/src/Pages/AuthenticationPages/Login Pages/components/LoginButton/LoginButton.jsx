import React from 'react';
import './LoginButton.css';

const LoginButton = ({ 
  isFormValid, 
  isSubmitting 
}) => {
  return (
    <button 
      type="submit" 
      className={`login-button ${isFormValid && !isSubmitting ? 'enabled' : 'disabled'}`}
      disabled={!isFormValid || isSubmitting}
    >
      {isSubmitting ? 'Signing In...' : 'Sign In'}
    </button>
  );
};

export default LoginButton;