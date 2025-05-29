import React from 'react';
import './About.css';

const AboutUs = () => {
  return (
    <div className="about-container">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>Our Story</h1>
          <p>Discover how we started and where we're going.</p>
        </div>
        <div className="hero-media">
          <img src="/assets/brand-photo.jpg" alt="Our Brand" /> 
          
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="panel mission">
          <h2>Our Mission</h2>
          <p>To empower users with reliable digital services and innovative experiences.</p>
        </div>
        <div className="panel vision">
          <h2>Our Vision</h2>
          <p>To be the leading platform that transforms the way people interact online.</p>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="timeline">
        <h2>Our Journey</h2>
        <div className="timeline-container">
          <div className="timeline-item">
            <span>2020</span>
            <p>Company founded with a small remote team.</p>
          </div>
          <div className="timeline-item">
            <span>2021</span>
            <p>Launched our first web application.</p>
          </div>
          <div className="timeline-item">
            <span>2022</span>
            <p>Reached 100,000+ users and expanded our services.</p>
          </div>
          <div className="timeline-item">
            <span>2023</span>
            <p>Opened new office and launched mobile app.</p>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="leadership">
        <h2>Meet Our Leadership</h2>
        <div className="team-grid">
          <div className="team-member">
            <img src="/assets/founder.jpg" alt="Founder" />
            <h3>Ayush Sharma</h3>
            <p>Founder & CEO</p>
          </div>
          <div className="team-member">
            <img src="/assets/cto.jpg" alt="CTO" />
            <h3>Sam Alt</h3>
            <p>Chief Technology Officer</p>
          </div>
        </div>
      </section>

      {/* Values & Culture */}
      <section className="values-culture">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-item">
            <span>🚀</span>
            <p>Innovation</p>
          </div>
          <div className="value-item">
            <span>🤝</span>
            <p>Collaboration</p>
          </div>
          <div className="value-item">
            <span>📈</span>
            <p>Growth</p>
          </div>
          <div className="value-item">
            <span>🌍</span>
            <p>Impact</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;

