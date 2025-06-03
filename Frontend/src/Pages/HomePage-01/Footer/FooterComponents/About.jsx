import React from 'react';
import './About.css';

const AboutUs = () => {
  return (
    <div className="about-container">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">Est. 2020</span>
            <h1>Our Story</h1>
            <p className="hero-description">
              From a small remote team with big dreams to a platform serving hundreds of thousands of users worldwide. 
              Discover the journey that shaped who we are today and where we're heading tomorrow.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">100K+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Countries</span>
              </div>
              <div className="stat">
                <span className="stat-number">99.9%</span>
                <span className="stat-label">Uptime</span>
              </div>
            </div>
          </div>
          <div className="hero-media">
            <div className="hero-image-container">
              <img src="/assets/brand-photo.jpg" alt="Our Brand" />
              <div className="hero-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="section-header">
          <h2>What Drives Us</h2>
          <p>Our core beliefs and aspirations that guide every decision we make</p>
        </div>
        <div className="panels-container">
          <div className="panel mission">
            <div className="panel-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>To empower users with reliable digital services and innovative experiences that simplify their daily lives and unlock new possibilities for growth and connection.</p>
            <ul className="panel-list">
              <li>Delivering exceptional user experiences</li>
              <li>Building secure and reliable platforms</li>
              <li>Fostering innovation and creativity</li>
            </ul>
          </div>
          <div className="panel vision">
            <div className="panel-icon">🌟</div>
            <h3>Our Vision</h3>
            <p>To be the leading platform that transforms the way people interact online, creating a more connected, efficient, and meaningful digital world for everyone.</p>
            <ul className="panel-list">
              <li>Global accessibility and inclusion</li>
              <li>Sustainable technology solutions</li>
              <li>Community-driven development</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="timeline">
        <div className="section-header">
          <h2>Our Journey</h2>
          <p>Key milestones that shaped our company's evolution</p>
        </div>
        <div className="timeline-container">
          <div className="timeline-item">
            <div className="timeline-year">2020</div>
            <div className="timeline-content">
              <h4>The Beginning</h4>
              <p>Company founded with a small remote team of 5 passionate developers and designers.</p>
              <span className="timeline-tag">Foundation</span>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-year">2021</div>
            <div className="timeline-content">
              <h4>First Launch</h4>
              <p>Launched our first web application, gaining 1,000 users in the first month.</p>
              <span className="timeline-tag">Product</span>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-year">2022</div>
            <div className="timeline-content">
              <h4>Major Growth</h4>
              <p>Reached 100,000+ users and expanded our services to include enterprise solutions.</p>
              <span className="timeline-tag">Growth</span>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-year">2023</div>
            <div className="timeline-content">
              <h4>Expansion</h4>
              <p>Opened new office in San Francisco and launched our mobile app with 50K downloads.</p>
              <span className="timeline-tag">Scale</span>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-year">2024</div>
            <div className="timeline-content">
              <h4>Innovation</h4>
              <p>Introduced AI-powered features and expanded to serve users in over 50 countries.</p>
              <span className="timeline-tag">Innovation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="leadership">
        <div className="section-header">
          <h2>Meet Our Leadership</h2>
          <p>The visionaries and experts leading our mission forward</p>
        </div>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-image">
              <img src="/assets/founder.jpg" alt="Founder" />
              <div className="member-overlay">
                <div className="social-links">
                  <span>LinkedIn</span>
                  <span>Twitter</span>
                </div>
              </div>
            </div>
            <div className="member-info">
              <h3>Ayush Sharma</h3>
              <p className="member-title">Founder & CEO</p>
              <p className="member-bio">
                Visionary leader with 10+ years in tech. Previously at Google and Microsoft, 
                passionate about creating user-centric digital experiences.
              </p>
              <div className="member-expertise">
                <span>Strategy</span>
                <span>Product</span>
                <span>Leadership</span>
              </div>
            </div>
          </div>
          <div className="team-member">
            <div className="member-image">
              <img src="/assets/cto.jpg" alt="CTO" />
              <div className="member-overlay">
                <div className="social-links">
                  <span>LinkedIn</span>
                  <span>GitHub</span>
                </div>
              </div>
            </div>
            <div className="member-info">
              <h3>Sam Alt</h3>
              <p className="member-title">Chief Technology Officer</p>
              <p className="member-bio">
                Tech innovator and architecture expert. Former lead engineer at startups and Fortune 500 companies, 
                specializing in scalable systems and AI integration.
              </p>
              <div className="member-expertise">
                <span>Architecture</span>
                <span>AI/ML</span>
                <span>DevOps</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values & Culture */}
      <section className="values-culture">
        <div className="section-header">
          <h2>Our Values & Culture</h2>
          <p>The principles that define how we work and interact with each other</p>
        </div>
        <div className="values-grid">
          <div className="value-item">
            <div className="value-icon">🚀</div>
            <h4>Innovation</h4>
            <p>We embrace creativity and push boundaries to create breakthrough solutions</p>
          </div>
          <div className="value-item">
            <div className="value-icon">🤝</div>
            <h4>Collaboration</h4>
            <p>We believe in the power of teamwork and diverse perspectives</p>
          </div>
          <div className="value-item">
            <div className="value-icon">📈</div>
            <h4>Growth</h4>
            <p>We foster continuous learning and development for our team and users</p>
          </div>
          <div className="value-item">
            <div className="value-icon">🌍</div>
            <h4>Impact</h4>
            <p>We strive to make a positive difference in the world through technology</p>
          </div>
          <div className="value-item">
            <div className="value-icon">🔒</div>
            <h4>Trust</h4>
            <p>We maintain the highest standards of security and transparency</p>
          </div>
          <div className="value-item">
            <div className="value-icon">⚡</div>
            <h4>Excellence</h4>
            <p>We are committed to delivering quality in everything we do</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Join Our Journey?</h2>
          <p>Be part of our mission to transform digital experiences worldwide</p>
          <div className="cta-buttons">
            <button className="cta-primary">View Open Positions</button>
            <button className="cta-secondary">Contact Us</button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;