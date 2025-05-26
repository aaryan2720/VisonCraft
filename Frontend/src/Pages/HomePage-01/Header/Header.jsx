import React, { useState } from 'react';
import './Header.css';
import { useTranslation } from 'react-i18next';
import Logo from './Components/Logo/Logo';
import SearchBar from './Components/SearchBar/SearchBar';
import LoginButton from './Components/LoginButton/LoginButton';
import SignupButton from './Components/SignupButton/SignupButton';
import LanguageSelector from './Components/LanguageSelector/LanguageSelector';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Logo />
        
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchSubmit={handleSearchSubmit}
        />
        
        <div className="navbar-right">
          <div className="auth-buttons">
            <LoginButton />
            <SignupButton />
          </div>
          
          <LanguageSelector />
        </div>
      </div>
    </nav>
  );
};

export default Header;