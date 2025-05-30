// src/components/signup/SocialSignupButtons.jsx
import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { BsApple, BsMicrosoft } from 'react-icons/bs';

const SocialSignupButtons = ({ onSocialSignup }) => (
  <div className="social-signup">
    <button 
      className="social-button google"
      onClick={() => onSocialSignup('Google')}
    >
      <FcGoogle />
      <span>Google</span>
    </button>
    
    <button 
      className="social-button microsoft"
      onClick={() => onSocialSignup('Microsoft')}
    >
      <BsMicrosoft />
      <span>Microsoft</span>
    </button>
    
    <button 
      className="social-button apple"
      onClick={() => onSocialSignup('Apple')}
    >
      <BsApple />
      <span>Apple</span>
    </button>
  </div>
);

export default SocialSignupButtons;