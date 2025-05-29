// src/components/Services/FilterItem/FilterItem.jsx
import React from 'react';
import './FilterItem.css';
import { useTranslation } from 'react-i18next';

const FilterItem = ({ filter, active, onClick }) => {
  return (
    <div 
      className={`filter-item ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="filter-content">
        <div className="filter-icon">
          {filter.icon}
        </div>
        <span className="filter-name">
          <span className="desktop-text">{filter.fullName || filter.name}</span>
          <span className="mobile-text">
            {(filter.fullName || filter.name).replace(/\s*Document\s*/gi, '')}
          </span>
        </span>
      </div>
    </div>
  );
};

export default FilterItem;