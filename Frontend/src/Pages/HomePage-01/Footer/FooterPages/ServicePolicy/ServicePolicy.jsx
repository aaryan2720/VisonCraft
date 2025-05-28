import React from 'react';
import './ServicePolicy.css';

function ServicePolicy() {
  return (
    <div className="service-policy">
      <section className="policy-intro">
        <h1>Our Service Delivery Policy</h1>
        <p className="subtitle">Streamlining Government Documentation Process Made Simple</p>
        <p className="description">
          Welcome to DocNish, your trusted partner in streamlining government documentation processes. We simplify complex bureaucratic procedures, making them accessible and efficient for all citizens.
        </p>
      </section>

      <section className="policy-grid">
        <div className="policy-card">
          <i className="fas fa-file-alt icon"></i>
          <h3>Comprehensive Documentation Support</h3>
          <ul>
            <li>Personal identification documents</li>
            <li>Business registration certificates</li>
            <li>Property documentation</li>
            <li>Tax-related paperwork</li>
            <li>License applications</li>
          </ul>
        </div>
        <div className="policy-card">
          <i className="fas fa-clock icon"></i>
          <h3>Processing Durations</h3>
          <ul>
            <li>Basic documentation: 2–3 business days</li>
            <li>Complex applications: 5–7 business days</li>
            <li>Emergency requests: 24–48 hours</li>
            <li>Premium service: Same day processing</li>
          </ul>
        </div>
        <div className="policy-card">
          <i className="fas fa-shield-alt icon"></i>
          <h3>Our Role as Facilitator</h3>
          <p>
            Please note that GovDocs operates as an independent facilitator. We are not affiliated with any government body. While we assist in documentation processes, final approval and processing times are subject to respective authorities.
          </p>
        </div>
        <div className="policy-card">
          <i className="fas fa-user-check icon"></i>
          <h3>Your Responsibilities</h3>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Submit genuine documents</li>
            <li>Respond promptly to queries</li>
            <li>Review all information before submission</li>
          </ul>
        </div>
      </section>

      <section className="support-section">
            <h2>Need Help</h2>
      </section>
    </div>
  );
}

export default ServicePolicy;