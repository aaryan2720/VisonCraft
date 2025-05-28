import React from 'react';
import { useTranslation } from 'react-i18next';
import { socialLinks } from '../data/footerLinks';
import './FooterSocial.css';

const FooterSocial = () => {
  const { t } = useTranslation();
  
  return (
    <div className="footer-social">
      <h3>{t('footer.connectWithUs')}</h3>
      <div className="social-icons">
        {socialLinks.map((social, index) => (
          <a 
            key={index} 
            href={social.url} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <i className={social.icon}></i>
          </a>
        ))}
      </div>
    </div>
  );
};

export default FooterSocial;