import React from 'react';
import './Terms.css';

const TermsAndConditions = () => {
  return (
    <div className="terms-container">
      <header className="hero">
        <h1>Terms & Conditions</h1>
      </header>

      <nav className="toc-panel">
        <h2>Table of Contents</h2>
        <ul>
          <li><a href="#user-obligations">User Obligations</a></li>
          <li><a href="#governing-law">Governing Law</a></li>
          <li><a href="#limitations">Limitations of Liability</a></li>
          <li><a href="#modifications">Modifications</a></li>
          <li><a href="#contact">Contact Information</a></li>
        </ul>
      </nav>

      <section className="clauses">
        <article id="user-obligations">
          <h3>User Obligations</h3>
          <p>Users must comply with all applicable laws and refrain from any misuse of the platform.</p>
        </article>

        <article id="governing-law">
          <h3>Governing Law</h3>
          <p>These terms are governed by the laws of India. Any disputes will be subject to Indian jurisdiction.</p>
        </article>

        <article id="limitations">
          <h3>Limitations of Liability</h3>
          <p>We are not liable for any damages resulting from the use or inability to use our services.</p>
        </article>

        <article id="modifications">
          <h3>Modifications</h3>
          <p>We may revise these terms at any time without prior notice. Continued use signifies acceptance.</p>
        </article>

        <article id="contact">
          <h3>Contact Information</h3>
          <p>For questions, please contact us at support@example.com.</p>
        </article>
      </section>
    </div>
  );
};

export default TermsAndConditions;
