import React from 'react';
import './Partner.css'; // Import the CSS file

function Partner() {
  return (
    <div className="page">
      <div className="header">
        <div className="logo">DOCNISH</div>
        <h1>Group Companies</h1>
      </div>

      <div className="hero">
        <h1>Partner With Us</h1>
        <p>"Let'sCollaborate"</p>
      </div>

      <div className="section">
        <h2>Why Partner</h2>
        <p>Benefits will be displayed in icon-text blocks (to be added).</p>
      </div>

      <div className="section">
        <h2>Partner Models</h2>
        <p>Choose from the following models:</p>
        <ul>
          <li>Reseller</li>
          <li>Affiliate</li>
          <li>Joint-Venture</li>
        </ul>
      </div>

      <div className="form-section">
        <h2>Sign-Up Form</h2>
        <div>
          <label htmlFor="company-name">Company Name</label>
          <input
            type="text"
            id="company-name"
            name="company-name"
            placeholder="Enter company name"
          />

          <label htmlFor="contact">Contact</label>
          <input
            type="text"
            id="contact"
            name="contact"
            placeholder="Enter contact details"
          />

          <label htmlFor="partnership-type">Partnership Type</label>
          <select id="partnership-type" name="partnership-type">
            <option value="reseller">Reseller</option>
            <option value="affiliate">Affiliate</option>
            <option value="joint-venture">Joint-Venture</option>
          </select>

          <button className="button">Submit</button>
        </div>
      </div>
    </div>
  );
}

export default Partner;