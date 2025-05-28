import React from 'react';
import { useTranslation } from 'react-i18next';
import './FooterNewsletter.css';

const FooterNewsletter = () => {
  const { t } = useTranslation();
  
  return (
    <div className="footer-newsletter">
      <h3>{t('footer.newsletter')}</h3>
      <p>{t('footer.newsletterSubtext')}</p>
      <div className="newsletter-form">
        <input type="email" placeholder={t('footer.emailPlaceholder')} />
        <button type="submit">{t('footer.subscribe')}</button>
      </div>
    </div>
  );
};

export default FooterNewsletter;