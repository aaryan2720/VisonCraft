// src/components/signup/EmailPhoneInput.jsx
import React from 'react';
import FormGroup from './FormGroup';

const EmailPhoneInput = ({ inputType, value, onChange, error, otpSent, otpVerified, otpLoading, onSendOTP }) => (
  <FormGroup 
    label={
      <>
        Email / Phone Number
        {inputType && <span className="input-type">({inputType === 'email' ? 'Email' : 'Phone'})</span>}
      </>
    }
    error={error}
  >
    <div className="email-phone-container">
      <input
        type="text"
        id="emailOrPhone"
        name="emailOrPhone"
        value={value}
        onChange={onChange}
        className={error ? 'error' : ''}
        placeholder="Enter your email or phone number"
        disabled={otpSent && !otpVerified}
      />
      {!otpSent && (
        <button
          type="button"
          className="otp-button"
          onClick={onSendOTP}
          disabled={!value || otpLoading}
        >
          {otpLoading ? 'Sending...' : 'Send OTP'}
        </button>
      )}
    </div>
  </FormGroup>
);

export default EmailPhoneInput;