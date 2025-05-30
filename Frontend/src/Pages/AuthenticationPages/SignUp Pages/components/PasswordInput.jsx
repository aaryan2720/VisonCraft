// src/components/signup/PasswordInput.jsx
import React from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import FormGroup from './FormGroup';

const PasswordInput = ({ label, id, name, value, onChange, error, placeholder, showPassword, setShowPassword }) => (
  <FormGroup label={label} id={id} error={error}>
    <div className="password-input-container">
      <input
        type={showPassword ? 'text' : 'password'}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={error ? 'error' : ''}
        placeholder={placeholder}
      />
      <button 
        type="button" 
        className="toggle-password"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
      </button>
    </div>
  </FormGroup>
);

export default PasswordInput;