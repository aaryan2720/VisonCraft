import React from 'react';
import './EmailPhoneInput.css';

const EmailPhoneInput = ({ 
  value, 
  onChange, 
  inputType, 
  error, 
  hasSubmitted 
}) => {
  return (
    <div className="form-group">
      <label htmlFor="emailOrPhone">
        Email or Phone Number
        {inputType && <span className="input-type">({inputType})</span>}
      </label>
      <input
        type="text"
        id="emailOrPhone"
        name="emailOrPhone"
        value={value}
        onChange={onChange}
        className={error && hasSubmitted ? 'error' : ''}
        placeholder="Enter your email or phone number"
      />
      {error && hasSubmitted && <span className="error-message">{error}</span>}
    </div>
  );
};

export default EmailPhoneInput;