// src/components/Services/Services.jsx
import React, { useState } from 'react';
import './Services.css';
import { useTranslation } from 'react-i18next';
import FilterItem from './Components/FilterItem/FilterItem';
import ServiceCard from './Components/ServiceCard/ServiceCard';
import { services, filters } from './Components/constants';

const Services = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAllCards, setShowAllCards] = useState(false);
  const [showAllFilters, setShowAllFilters] = useState(false);

  const filteredServices = activeFilter === 'all' 
    ? services 
    : services.filter(service => service.category === activeFilter);

  // Only show first 3 cards initially, or all if "View More" is clicked
  const displayedServices = showAllCards ? filteredServices : filteredServices.slice(0, 4);
  const hasMoreCards = filteredServices.length > 3;

  // Reset showAllCards when filter changes
  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setShowAllCards(false);
  };

  // Get displayed filters based on showAllFilters state
  const displayedFilters = showAllFilters ? filters : filters.slice(0, 3);
  const hasMoreFilters = filters.length > 3;

  return (
    <div className="services-container" id="services">
      <div className={`service-filters ${showAllFilters ? 'expanded' : ''}`}>
        {displayedFilters.map(filter => (
          <FilterItem
            key={filter.id}
            filter={filter}
            active={activeFilter === filter.id}
            onClick={() => handleFilterChange(filter.id)}
          />
        ))}
        
        {hasMoreFilters && (
          <div 
            className="filter-expand-button"
            onClick={() => setShowAllFilters(!showAllFilters)}
          >
            <div className="expand-icon">
              {showAllFilters ? '−' : '+'}
            </div>
            <span className="expand-text">
              {showAllFilters ? 'Less' : 'More'}
            </span>
          </div>
        )}
      </div>
      
      <div className="service-cards">
        {displayedServices.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {hasMoreCards && !showAllCards && (
        <div className="view-more-container">
          <button 
            className="view-more-button"
            onClick={() => setShowAllCards(true)}
          >
            View More ({filteredServices.length - 3} more services)
          </button>
        </div>
      )}

      {showAllCards && hasMoreCards && (
        <div className="view-more-container">
          <button 
            className="view-less-button"
            onClick={() => setShowAllCards(false)}
          >
            View Less
          </button>
        </div>
      )}
    </div>
  );
};

export default Services;