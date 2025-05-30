// src/components/signup/SignupButton.jsx
import React from 'react';

const SignupButton = ({ isFormValid, isSubmitting, otpVerified }) => (
  <button 
    type="submit" 
    className={`signup-button ${isFormValid && !isSubmitting && otpVerified ? 'enabled' : 'disabled'}`}
    disabled={!isFormValid || isSubmitting || !otpVerified}
  >
    {isSubmitting ? 'Creating Account...' : 'Create Account'}
  </button>
);

export default SignupButton;