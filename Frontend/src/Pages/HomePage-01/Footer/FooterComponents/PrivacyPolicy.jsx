/* src/components/PrivacyPolicy.js */
import React from 'react';
import './PrivacyPolicy.css';

function PrivacyPolicy() {
  const sections = [
    { title: 'Data Collected', items: [
      'Personal identification information such as name, email address, and contact details.',
      'Usage data and analytics that help us understand how you interact with our services.',
      'Device and browser information to ensure compatibility and security.',
      'Communication preferences to deliver relevant updates and information.'
    ]},
    { title: 'Use of Cookies', items: [
      'Remember your preferences and settings across sessions.',
      'Analyze site traffic and performance metrics.',
      'Provide personalized content and recommendations.',
      'Maintain secure sessions and prevent unauthorized access.'
    ]},
    { title: 'Usage of Information', items: [
      'Service delivery and continuous improvement of our offerings.',
      'Communication with users about updates and important information.',
      'Security measures to prevent fraud and unauthorized access.',
      'Legal compliance with applicable regulations and requirements.'
    ]},
    { title: 'Sharing of Information', items: [
      'Service providers and business partners who assist in our operations.',
      'Legal authorities when required by law or court order.',
      'Third-party analytics services for performance monitoring.',
      'Business entities in case of merger, acquisition, or sale of assets.'
    ]},
    { title: 'User Rights', items: [
      'Right to access and receive a copy of your personal information.',
      'Right to correct any inaccurate or incomplete information.',
      'Right to request deletion of your personal data.',
      'Right to withdraw consent for data processing at any time.',
      'Right to data portability for transferring your information.'
    ]},
  ];

  return (
    <div className="privacy-policy">
      <header>
        <h1>Privacy Policy</h1>
        <p className="privacy-subtitle">We are committed to protecting ...</p>
      </header>

      {/* Language Buttons */}
      <div className="lang-select">
        <button>English</button>
        <button>Marathi</button>
        <button>Hindi</button>
      </div>

      <section className="privacy-sections">
        {sections.map((sec, i) => (
          <div key={i} className="privacy-section">
            <h2>{sec.title}</h2>
            <ul>{sec.items.map((item,j)=><li key={j}>{item}</li>)}</ul>
          </div>
        ))}
      </section>
    </div>
  );
}

export default PrivacyPolicy;

