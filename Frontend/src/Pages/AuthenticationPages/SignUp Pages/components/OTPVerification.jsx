// src/components/signup/OTPVerification.jsx
import React from 'react';
import FormGroup from './FormGroup';

const OTPVerification = ({ otp, setOtp, otpLoading, otpError, onVerifyOTP }) => (
  <FormGroup label="Verification Code" error={otpError}>
    <div className="otp-container">
      <input
        type="text"
        id="otp"
        name="otp"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter 6-digit OTP"
        maxLength="6"
      />
      <button
        type="button"
        className="verify-button"
        onClick={onVerifyOTP}
        disabled={!otp || otpLoading}
      >
        {otpLoading ? 'Verifying...' : 'Verify'}
      </button>
    </div>
  </FormGroup>
);

export default OTPVerification;