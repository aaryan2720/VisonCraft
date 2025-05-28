import React from 'react';
import './Footer.css';
import { useTranslation } from 'react-i18next';
import { footerLinks } from './Components/data/footerLinks';
import FooterColumn from './Components/FooterColumn/FooterColumn';
import FooterNewsletter from './Components/FooterNewsletter/FooterNewsletter';
import FooterSocial from './Components/FooterSocial/FooterSocial';
import FooterBottom from './Components/FooterBottom/FooterBottom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <FooterColumn 
            title="About" 
            icon="📌" 
            links={footerLinks.about} 
            translationKey="about"
          />
          <FooterColumn 
            title="Group Companies" 
            icon="🧩" 
            links={footerLinks.groupCompanies} 
            translationKey="groupCompanies"
          />
          <FooterColumn 
            title="Help" 
            icon="🛟" 
            links={footerLinks.help} 
            translationKey="help"
          />
          <FooterColumn 
            title="Consumer Policy" 
            icon="🛡️" 
            links={footerLinks.consumerPolicy} 
            translationKey="consumerPolicy"
          />
        </div>

        <div className="footer-middle">
          <FooterNewsletter />
          <FooterSocial />
        </div>

        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;