// src/components/signup/FormGroup.jsx
import React from 'react';

const FormGroup = ({ label, id, name, value, onChange, error, placeholder, children }) => (
  <div className="form-group">
    <label htmlFor={id}>{label}</label>
    {children || (
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={error ? 'error' : ''}
        placeholder={placeholder}
      />
    )}
    {error && <span className="error-message">{error}</span>}
  </div>
);

export default FormGroup;