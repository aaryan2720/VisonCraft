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

  const filteredServices = activeFilter === 'all' 
    ? services 
    : services.filter(service => service.category === activeFilter);

  return (
    <div className="services-container" id="services">
      <div className="service-filters">
        {filters.map(filter => (
          <FilterItem
            key={filter.id}
            filter={filter}
            active={activeFilter === filter.id}
            onClick={() => setActiveFilter(filter.id)}
          />
        ))}
      </div>
      
      <div className="service-cards">
        {filteredServices.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default Services;