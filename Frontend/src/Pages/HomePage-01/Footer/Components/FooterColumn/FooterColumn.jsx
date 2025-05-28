import React from 'react';
import { useTranslation } from 'react-i18next';
import FooterLink from '../FooterLink/FooterLink';
import './FooterColumn.css';

const FooterColumn = ({ title, icon, links, translationKey }) => {
  const { t } = useTranslation();
  
  return (
    <div className="footer-column">
      <h3 className="footer-heading">
        <span className="footer-icon">{icon}</span> {t(`footer.${translationKey}`)}
      </h3>
      <ul className="footer-links">
        {links.map((link, index) => (
          <FooterLink key={index} text={link.text} path={link.path} />
        ))}
      </ul>
    </div>
  );
};

export default FooterColumn;