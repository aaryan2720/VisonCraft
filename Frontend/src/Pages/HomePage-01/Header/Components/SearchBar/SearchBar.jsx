import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SearchBar.css';

const SearchBar = ({ searchQuery, setSearchQuery, handleSearchSubmit }) => {
  const { t } = useTranslation();
  
  return (
    <div className="navbar-search">
      <form onSubmit={handleSearchSubmit}>
        <input 
          type="text" 
          placeholder={t('navbar.search')} 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          <span className="search-icon">🔍</span>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;