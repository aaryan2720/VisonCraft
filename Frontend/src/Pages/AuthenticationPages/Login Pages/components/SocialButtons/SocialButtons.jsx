import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { BsApple, BsMicrosoft } from 'react-icons/bs';
import './SocialButtons.css';

const SocialButtons = ({ handleSocialLogin }) => {
  return (
    <div className="social-login">
      <button 
        className="social-button google"
        onClick={() => handleSocialLogin('Google')}
      >
        <FcGoogle />
        <span>Google</span>
      </button>
      
      <button 
        className="social-button microsoft"
        onClick={() => handleSocialLogin('Microsoft')}
      >
        <BsMicrosoft />
        <span>Microsoft</span>
      </button>
      
      <button 
        className="social-button apple"
        onClick={() => handleSocialLogin('Apple')}
      >
        <BsApple />
        <span>Apple</span>
      </button>
    </div>
  );
};

export default SocialButtons;