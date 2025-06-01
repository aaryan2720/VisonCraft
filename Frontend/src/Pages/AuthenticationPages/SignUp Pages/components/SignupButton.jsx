// src/components/signup/SignupButton.jsx
import React from 'react';

const SignupButton = ({ isFormValid, isSubmitting, otpVerified, inputType }) => {
  const isButtonEnabled = isFormValid && !isSubmitting && (inputType === 'email' || otpVerified);
  
  return (
    <button 
      type="submit" 
      className={`signup-button ${isButtonEnabled ? 'enabled' : 'disabled'}`}
      disabled={!isButtonEnabled}
    >
      {isSubmitting ? 'Creating Account...' : 'Create Account'}
    </button>
  );
};

export default SignupButton;