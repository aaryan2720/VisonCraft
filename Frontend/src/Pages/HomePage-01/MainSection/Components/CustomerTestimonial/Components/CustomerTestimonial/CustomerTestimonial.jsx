import React, { useRef, useEffect, useState } from 'react';
import './CustomerTestimonial.css';
import { useTranslation } from 'react-i18next';
import TestimonialCard from '../TestimonialCard/TestimonialCard';
import { testimonials } from '../constants';

const CustomerTestimonial = () => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const cardsRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef(null);
  const speed = 0.5; // Adjust scrolling speed (lower = slower)

  useEffect(() => {
    const scrollContainer = containerRef.current;
    const cardsContainer = cardsRef.current;
    let scrollAmount = 0;
    let cardWidth = 350; // Fixed card width

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollContainer.scrollLeft += speed;
        scrollAmount += speed;
        
        // Reset to start when reaching the end of first set
        if (scrollAmount >= cardWidth * testimonials.length) {
          scrollContainer.scrollLeft = 0;
          scrollAmount = 0;
        }
      }
      animationRef.current = requestAnimationFrame(scroll);
    };

    // Initialize scroll position
    scrollContainer.scrollLeft = 0;
    animationRef.current = requestAnimationFrame(scroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused]);

  return (
    <div className="testimonial-section">
      <h2 className="testimonial-heading">{t('testimonials.heading')}</h2>
      
      <div 
        className="testimonial-scroll-container"
        ref={containerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="testimonial-cards" ref={cardsRef}>
          {/* Original cards */}
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={`original-${testimonial.id}`} 
              testimonial={testimonial} 
            />
          ))}
          {/* Duplicate cards for seamless looping */}
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={`duplicate-${testimonial.id}`} 
              testimonial={testimonial} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerTestimonial;