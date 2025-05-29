import React, { useState } from 'react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const { language, changeLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English' , letter: 'E'  },
    { code: 'mr', name: 'Marathi', letter: 'M' },
    { code: 'hi', name: 'Hindi', letter: 'H' }
  ];

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setShowLanguageDropdown(false);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowLanguageDropdown(!showLanguageDropdown);
  };

  return (
    <div className="language-selector">
      <div className="language-display">
        <span className="language-text">
          {languages.find(lang => lang.code === language)?.name}
        </span>
        <button 
          className="dropdown-toggle"
          onClick={toggleDropdown}
        >
          <span className="dropdown-arrow">▼</span>
        </button>
      </div>
      
      {showLanguageDropdown && (
        <div className="language-dropdown">
          {languages
            .filter(lang => lang.code !== language)
            .map((lang) => (
              <div 
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className="language-option"
              >
                {lang.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;