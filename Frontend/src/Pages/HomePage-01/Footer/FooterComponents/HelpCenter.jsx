/* src/components/HelpCenter.js */
import React from 'react';
import './HelpCenter.css';

function HelpCenter() {
  const topics = [
    { icon: 'fas fa-user-circle', title: 'Account Issues', desc: 'Password reset, account security, and profile settings' },
    { icon: 'fas fa-dollar-sign', title: 'Payment Help', desc: 'Billing issues, refunds, and subscription management' },
    { icon: 'fas fa-file-upload', title: 'Document Upload', desc: 'File requirements, upload troubleshooting, and verification' },
    { icon: 'fas fa-cog', title: 'Technical Support', desc: 'System requirements, bugs, and technical issues' },
  ];

  return (
    <div className="help-center">
      <h1>How can we help?</h1>
      <div className="help-search">
        <input type="text" placeholder="Search for help articles..." />
      </div>
      <div className="help-topics">
        {topics.map((t,i) => (
          <div key={i} className="help-card">
            <i className={t.icon}></i>
            <h3>{t.title}</h3>
            <p>{t.desc}</p>
          </div>
        ))}
      </div>

      {/* Request Callback Button */}
      <div className="help-footer">
        <button className="callback-btn"><i className="fas fa-phone"></i> Request a Callback</button>
      </div>

      {/* Complaint Form */}
      <div className="complaint-form">
        <h2>Submit a Complaint</h2>
        <textarea placeholder="Describe your issue..." />
        <button className="submit-complaint">Submit</button>
      </div>
    </div>
  );
}

export default HelpCenter;
