import React from 'react';
import './CustomerTestimonial.css';
import { useTranslation } from 'react-i18next';

const CustomerTestimonial = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      id: 1,
      name: 'Rahul Sharma',
      image: '/images/testimonials/user1.jpg',
      daysAgo: 5,
      rating: 5,
      service: 'panCard',
      feedback: 'user1'
    },
    {
      id: 2,
      name: 'Priya Patel',
      image: '/images/testimonials/user2.jpg',
      daysAgo: 7,
      rating: 4,
      service: 'aadharCard',
      feedback: 'user2'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      image: '/images/testimonials/user3.jpg',
      daysAgo: 10,
      rating: 5,
      service: 'voterID',
      feedback: 'user3'
    }
  ];

  return (
    <div className="testimonial-container">
      <h2 className="testimonial-heading">{t('testimonials.heading')}</h2>
      
      <div className="testimonial-cards">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="testimonial-card">
            <div className="testimonial-header">
              <div className="user-image">
                <img src={testimonial.image} alt={testimonial.name} />
              </div>
              <div className="user-info">
                <h4 className="user-name">{testimonial.name}</h4>
                <p className="days-ago">{testimonial.daysAgo} {t('testimonials.daysAgo')}</p>
              </div>
            </div>
            
            <div className="testimonial-rating">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`star ${i < testimonial.rating ? 'filled' : ''}`}>★</span>
              ))}
            </div>
            
            <div className="testimonial-service">
              <span>{t('testimonials.service')}: </span>
              {t(`services.serviceNames.${testimonial.service}`)}
            </div>
            
            <p className="testimonial-feedback">
              {t(`testimonials.feedback.${testimonial.feedback}`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerTestimonial;