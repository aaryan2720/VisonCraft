import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import './PasswordInput.css';

const PasswordInput = ({ 
  value, 
  onChange, 
  error, 
  hasSubmitted 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-group">
      <label htmlFor="password">Password</label>
      <div className="password-input-container">
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          name="password"
          value={value}
          onChange={onChange}
          className={`password-input ${error && hasSubmitted ? 'error' : ''}`}
          placeholder="Enter your password"
        />
        <button 
          type="button" 
          className="toggle-password"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </button>
      </div>
      {error && hasSubmitted && <span className="error-message">{error}</span>}
    </div>
  );
};

export default PasswordInput;