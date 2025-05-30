// src/components/signup/SignupImageSection.jsx
import React from 'react';

const SignupImageSection = () => (
  <div className="signup-image-section">
    <div className="image-container">
      <img 
        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
        alt="Medical professionals" 
        className="signup-image"
      />
      <div className="image-overlay">
      <div className="overlay-content">
                <h2>Join DocNish Today</h2>
                <p>Get all Your Documents by just a click</p>
                <div className="features-list">
                  <div className="feature-item">
                    <span className="checkmark">✓</span>
                    <span>24/7 customer Support</span>
                  </div>
                  <div className="feature-item">
                    <span className="checkmark">✓</span>
                    <span>Verified Documents Providers</span>
                  </div>
                  <div className="feature-item">
                    <span className="checkmark">✓</span>
                    <span>Secure & Confidential</span>
                  </div>
                </div>
              </div>
      </div>
    </div>
  </div>
);

export default SignupImageSection;