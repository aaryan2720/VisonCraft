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
        <span className="filter-name">{filter.fullName || filter.name}</span>
      </div>
    </div>
  );
};

export default FilterItem;