import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-column">
            <h3 className="footer-heading">
              <span className="footer-icon">📌</span> ABOUT
            </h3>
            <ul className="footer-links">
              <li><Link to="/contact-us">Contact Us</Link></li>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/news">News & Updates</Link></li>
              <li><Link to="/corporate">Corporate Information</Link></li>
              <li><Link to="/press">Press</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">
              <span className="footer-icon">🧩</span> GROUP COMPANIES
            </h3>
            <ul className="footer-links">
              <li><Link to="/partner">Partner With Us</Link></li>
              <li><Link to="/download-app">Download App</Link></li>
              <li><Link to="/certifications">Trust Badges / Certifications</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">
              <span className="footer-icon">🛟</span> HELP
            </h3>
            <ul className="footer-links">
              <li><Link to="/help-center">Help Center</Link></li>
              <li><Link to="/payments">Payments</Link></li>
              <li><Link to="/shipping">Shipping</Link></li>
              <li><Link to="/cancellation-returns">Cancellation & Returns</Link></li>
              <li><Link to="/faqs">FAQs</Link></li>
              <li><Link to="/track">Track Application</Link></li>
              <li><Link to="/callback">Request a Callback</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">
              <span className="footer-icon">🛡️</span> CONSUMER POLICY
            </h3>
            <ul className="footer-links">
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy">Refund & Cancellation Policy</Link></li>
              <li><Link to="/security">Security</Link></li>
              <li><Link to="/sitemap">Sitemap</Link></li>
              <li><Link to="/grievance">Grievance Redressal</Link></li>
              <li><Link to="/epr-compliance">EPR Compliance</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-middle">
          <div className="footer-newsletter">
            <h3>Subscribe to our Newsletter</h3>
            <p>Stay updated with our latest news and offers</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </div>
          </div>
          
          <div className="footer-social">
            <h3>Connect With Us</h3>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            <p>&copy; {currentYear} DocNish. All Rights Reserved.</p>
          </div>
          <div className="payment-methods">
            <p>Secure Payments</p>
            <div className="payment-icons">
              <span>Visa</span>
              <span>MasterCard</span>
              <span>PayPal</span>
              <span>UPI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;