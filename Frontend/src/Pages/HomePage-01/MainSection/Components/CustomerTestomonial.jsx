import React, { useEffect, useRef, useState } from 'react';
import './CustomerTestimonial.css';

const CustomerTestimonial = () => {
  const testimonialRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef(null);

  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: 'Rahul Sharma',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      daysAgo: 3,
      stars: 5,
      service: 'PAN Card',
      feedback: 'Excellent service! Got my PAN card within the promised time. The process was smooth and hassle-free. Would definitely recommend DocNish to everyone.'
    },
    {
      id: 2,
      name: 'Priya Patel',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      daysAgo: 7,
      stars: 4,
      service: 'Voter ID (EPIC)',
      feedback: 'Very professional service. The team guided me through the entire process. My Voter ID was delivered on time. Great experience overall!'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      image: 'https://randomuser.me/api/portraits/men/62.jpg',
      daysAgo: 12,
      stars: 5,
      service: 'GST Registration',
      feedback: 'DocNish made my GST registration process incredibly simple. Their team is knowledgeable and responsive. Highly recommended for business services!'
    },
    {
      id: 4,
      name: 'Sneha Gupta',
      image: 'https://randomuser.me/api/portraits/women/26.jpg',
      daysAgo: 5,
      stars: 5,
      service: 'Passport',
      feedback: 'I was worried about my passport application, but DocNish handled everything perfectly. Their attention to detail is impressive. Thank you!'
    },
    {
      id: 5,
      name: 'Vikram Singh',
      image: 'https://randomuser.me/api/portraits/men/11.jpg',
      daysAgo: 15,
      stars: 4,
      service: 'Driving License',
      feedback: 'Got my driving license renewed through DocNish. The process was quick and the team was very helpful throughout. Great service!'
    },
    {
      id: 6,
      name: 'Meera Joshi',
      image: 'https://randomuser.me/api/portraits/women/57.jpg',
      daysAgo: 2,
      stars: 5,
      service: 'Ayushman Bharat Card',
      feedback: 'DocNish helped my family get Ayushman Bharat cards. Their service was prompt and they explained everything clearly. Very satisfied!'
    }
  ];

  // Clone testimonials for infinite scroll effect
  const allTestimonials = [...testimonials, ...testimonials];

  // Animation for continuous sliding
  useEffect(() => {
    const scrollContainer = testimonialRef.current;
    if (!scrollContainer) return;

    // Calculate the width of a single set of testimonials
    const scrollWidth = scrollContainer.scrollWidth / 2;
    let scrollPos = 0;
    
    const scroll = () => {
      if (isPaused) {
        animationRef.current = requestAnimationFrame(scroll);
        return;
      }
      
      scrollPos += 0.5; // Adjust speed here
      
      // Reset position when we've scrolled through one set
      if (scrollPos >= scrollWidth) {
        scrollPos = 0;
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft = scrollPos;
      }
      
      animationRef.current = requestAnimationFrame(scroll);
    };
    
    animationRef.current = requestAnimationFrame(scroll);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused]);

  // Render stars based on rating
  const renderStars = (count) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < count ? 'star filled' : 'star'}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="testimonial-section">
      <h2 className="testimonial-heading">What Our Customers Say</h2>
      
      <div 
        className="testimonial-container" 
        ref={testimonialRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="testimonial-track">
          {allTestimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={`${testimonial.id}-${index}`}>
              <div className="testimonial-header">
                <div className="testimonial-user">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="user-image" 
                  />
                  <div className="user-info">
                    <h3 className="user-name">{testimonial.name}</h3>
                    <p className="days-ago">{testimonial.daysAgo} days ago</p>
                  </div>
                </div>
                <div className="testimonial-rating">
                  {renderStars(testimonial.stars)}
                </div>
              </div>
              
              <div className="testimonial-service">
                Service: <span>{testimonial.service}</span>
              </div>
              
              <div className="testimonial-feedback">
                "{testimonial.feedback}"
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerTestimonial;