import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Services.css';
import { useTranslation } from 'react-i18next';

const Services = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');

  const services = [
    {
      id: 'pancard',
      name: 'panCard',
      displayName: 'PAN Card',
      category: 'identity',
      fees: '₹500',
      timeRequired: '15-20 days',
      description: 'Apply for a new PAN card or make corrections to your existing PAN card details.',
      logo: '💳'
    },
    {
      id: 'aadharcard',
      name: 'aadharCard',
      displayName: 'Aadhar Card',
      category: 'identity',
      fees: '₹200',
      timeRequired: '7-10 days',
      description: 'Update your Aadhar card details or apply for a new Aadhar card.',
      logo: '🪪'
    },
    {
      id: 'voterid',
      name: 'voterID',
      displayName: 'Voter ID',
      category: 'identity',
      fees: '₹300',
      timeRequired: '20-25 days',
      description: 'Register for a new Voter ID card or update your existing voter information.',
      logo: '🗳️'
    },
    {
      id: 'passport',
      name: 'passport',
      displayName: 'Passport',
      category: 'identity',
      fees: '₹1500',
      timeRequired: '30-45 days',
      description: 'Apply for a new passport, renew your existing passport or apply for passport services.',
      logo: '🛂'
    },
    {
      id: 'drivinglicense',
      name: 'drivingLicense',
      displayName: 'Driving License',
      category: 'identity',
      fees: '₹800',
      timeRequired: '15-20 days',
      description: 'Apply for a new driving license or renew your existing driving license.',
      logo: '🚗'
    },
    {
      id: 'incometax',
      name: 'incomeTax',
      displayName: 'Income Tax Return',
      category: 'financial',
      fees: '₹1000',
      timeRequired: '3-5 days',
      description: 'File your income tax returns with expert assistance and guidance.',
      logo: '💰'
    },
    {
      id: 'birthcertificate',
      name: 'birthCertificate',
      displayName: 'Birth Certificate',
      category: 'education',
      fees: '₹400',
      timeRequired: '10-15 days',
      description: 'Apply for a birth certificate or get a duplicate copy of your birth certificate.',
      logo: '👶'
    },
    {
      id: 'propertyregistration',
      name: 'propertyRegistration',
      displayName: 'Property Registration',
      category: 'property',
      fees: '₹2500',
      timeRequired: '25-30 days',
      description: 'Register your property documents and complete all legal formalities.',
      logo: '🏠'
    }
  ];

  const filters = [
    { id: 'all', name: 'all', icon: '🔍' },
    { id: 'identity', name: 'identity', icon: '🪪' },
    { id: 'financial', name: 'financial', icon: '💰' },
    { id: 'education', name: 'education', icon: '🎓' },
    { id: 'property', name: 'property', icon: '🏠' }
  ];

  const filteredServices = activeFilter === 'all' 
    ? services 
    : services.filter(service => service.category === activeFilter);

  return (
    <div className="services-container" id="services">
      <div className="service-filters">
        {filters.map(filter => (
          <div 
            key={filter.id}
            className={`filter-item ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.id)}
          >
            <span className="filter-icon">{filter.icon}</span> {t(`services.filters.${filter.name}`)}
          </div>
        ))}
      </div>
      
      <div className="service-cards">
        {filteredServices.map(service => (
          <div key={service.id} className="service-card">
            <div className="service-logo">
              <span className="service-icon">{service.logo}</span>
            </div>
            <h3 className="service-title">{service.displayName}</h3>
            <div className="service-details">
              <div className="detail-item">
                <span className="detail-label">{t('services.fees')}:</span>
                <span className="detail-value">{service.fees}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t('services.timeRequired')}:</span>
                <span className="detail-value">{service.timeRequired}</span>
              </div>
            </div>
            <p className="service-description">{service.description}</p>
            <Link to={`/apply/${service.id}`} className="apply-button">
              {t('services.applyNow')}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;