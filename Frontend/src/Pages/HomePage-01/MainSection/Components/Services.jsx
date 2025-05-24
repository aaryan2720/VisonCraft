import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

// Import icons (you'll need to install a package like react-icons or use images)
// For now, I'll use placeholder emoji icons

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState('Identity Documents');

  const serviceCategories = [
    {
      id: 'identity',
      name: 'Identity Documents',
      icon: '🪪',
      services: [
        {
          id: 'pan',
          name: 'PAN Card',
          logo: '💳',
          fees: '₹499',
          timeRequired: '15-20 days',
          description: 'Get your PAN Card with hassle-free processing'
        },
        {
          id: 'voter',
          name: 'Voter ID (EPIC)',
          logo: '🗳️',
          fees: '₹399',
          timeRequired: '30 days',
          description: 'Apply for your Voter ID card easily'
        },
        {
          id: 'passport',
          name: 'Passport',
          logo: '🛂',
          fees: '₹1500',
          timeRequired: '30-45 days',
          description: 'Complete passport application assistance'
        },
        {
          id: 'driving-license',
          name: 'Driving License',
          logo: '🚗',
          fees: '₹799',
          timeRequired: '15-30 days',
          description: 'Get your driving license with expert guidance'
        }
      ]
    },
    {
      id: 'health',
      name: 'Health & Welfare',
      icon: '🏥',
      services: [
        {
          id: 'ayushman',
          name: 'Ayushman Bharat Card',
          logo: '🏥',
          fees: '₹299',
          timeRequired: '15-20 days',
          description: 'Apply for Ayushman Bharat health coverage'
        }
      ]
    },
    {
      id: 'business',
      name: 'Business & Financial',
      icon: '💼',
      services: [
        {
          id: 'msme',
          name: 'MSME/Udyam Registration',
          logo: '🏭',
          fees: '₹999',
          timeRequired: '7-10 days',
          description: 'Register your business as MSME/Udyam'
        },
        {
          id: 'gst',
          name: 'GST Registration Certificate',
          logo: '📝',
          fees: '₹1299',
          timeRequired: '7-15 days',
          description: 'Complete GST registration assistance'
        }
      ]
    },
    {
      id: 'legal',
      name: 'Legal & Civic',
      icon: '⚖️',
      services: [
        {
          id: 'police',
          name: 'Police Verification Certificate',
          logo: '👮',
          fees: '₹599',
          timeRequired: '15-30 days',
          description: 'Get police verification certificate easily'
        }
      ]
    },
    {
      id: 'vehicle',
      name: 'Vehicle Related Services',
      icon: '🚗',
      services: [
        {
          id: 'duplicate-rc',
          name: 'Duplicate RC',
          logo: '📄',
          fees: '₹799',
          timeRequired: '15-30 days',
          description: 'Get duplicate Registration Certificate'
        },
        {
          id: 'ownership',
          name: 'Ownership Transfer',
          logo: '🔄',
          fees: '₹1299',
          timeRequired: '15-30 days',
          description: 'Transfer vehicle ownership smoothly'
        },
        {
          id: 'driving-license-vehicle',
          name: 'Driving License',
          logo: '🚗',
          fees: '₹799',
          timeRequired: '15-30 days',
          description: 'Get your driving license with expert guidance'
        },
        {
          id: 'fitness',
          name: 'Vehicle Fitness Certificate',
          logo: '✅',
          fees: '₹699',
          timeRequired: '7-15 days',
          description: 'Get vehicle fitness certificate'
        },
        {
          id: 'insurance',
          name: 'Vehicle Insurance',
          logo: '🛡️',
          fees: '₹499',
          timeRequired: '1-3 days',
          description: 'Get the best vehicle insurance'
        },
        {
          id: 'puc',
          name: 'Pollution Under Control (PUC) Certificate',
          logo: '🌿',
          fees: '₹299',
          timeRequired: '1-2 days',
          description: 'Get PUC certificate quickly'
        }
      ]
    }
  ];

  // Find the selected category
  const selectedCategoryData = serviceCategories.find(
    category => category.name === selectedCategory
  );

  return (
    <div className="services-container">
      <div className="service-filters">
        {serviceCategories.map((category) => (
          <div 
            key={category.id}
            className={`filter-item ${selectedCategory === category.name ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.name)}
          >
            <span className="filter-icon">{category.icon}</span>
            <span className="filter-name">{category.name}</span>
          </div>
        ))}
      </div>
      
      <div className="service-cards">
        {selectedCategoryData && selectedCategoryData.services.map((service) => (
          <div key={service.id} className="service-card">
            <div className="service-logo">
              {service.logo}
            </div>
            <h3 className="service-name">{service.name}</h3>
            <p className="service-consultancy">Consultancy Service</p>
            <div className="service-details">
              <div className="detail-item">
                <span className="detail-label">Fees:</span>
                <span className="detail-value">{service.fees}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Time Required:</span>
                <span className="detail-value">{service.timeRequired}</span>
              </div>
            </div>
            <p className="service-description">{service.description}</p>
            <Link to={`/apply/${service.id}`} className="apply-button">Apply Now</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;