import React from 'react';
import { useTranslation } from 'react-i18next';
import { paymentMethods } from '../data/footerLinks';
import './FooterBottom.css';

const FooterBottom = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  
  return (
    <div className="footer-bottom">
      <div className="copyright">
        <p>&copy; {currentYear} DocNish. {t('footer.copyright')}</p>
      </div>
      <div className="payment-methods">
        <p>{t('footer.securePayments')}</p>
        <div className="payment-icons">
          {paymentMethods.map((method, index) => (
            <span key={index}>{method}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;