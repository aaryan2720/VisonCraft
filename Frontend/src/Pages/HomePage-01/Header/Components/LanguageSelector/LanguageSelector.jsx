import React, { useState } from 'react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const { language, changeLanguage } = useLanguage();

  const getLanguageName = (code) => {
    switch(code) {
      case 'en': return 'English';
      case 'hi': return 'Hindi';
      case 'mr': return 'Marathi';
      default: return 'English';
    }
  };

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setShowLanguageDropdown(false);
  };

  return (
    <div className="language-selector">
      <span className="language-text"></span>
      <button 
        className="language-button"
        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
      >
        {getLanguageName(language)} <span className="dropdown-arrow">▼</span>
      </button>
      
      {showLanguageDropdown && (
        <div className="language-dropdown">
          <div onClick={() => handleLanguageChange('en')}>English</div>
          <div onClick={() => handleLanguageChange('hi')}>Hindi</div>
          <div onClick={() => handleLanguageChange('mr')}>Marathi</div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;