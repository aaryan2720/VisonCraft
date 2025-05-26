import React, { useState } from 'react';
import './Faqs.css';

const faqList = [
  {
    q: 'How do I update my Aadhaar details online?',
    a: 'You can update your Aadhaar details by selecting the Aadhaar Card Update service, filling out the form, and submitting the required documents.',
  },
  {
    q: 'What is the processing time for a new PAN card?',
    a: 'PAN card applications typically take 10–15 business days. You can expedite via premium services for same-day processing.',
  },
  {
    q: 'Can I track my application status?',
    a: 'Yes, use the Application Tracker on your dashboard to see real-time progress of your requests.',
  },
  {
    q: 'What documents are required for a driving license?',
    a: 'You need a valid ID proof, address proof, and passport-sized photographs. Detailed requirements are listed under the Driving License service.',
  },
  {
    q: 'How do I request a refund?',
    a: 'Contact our support team via the Help Center and provide your application ID to initiate a refund process.',
  },
];

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="faqs-container">
      <h1>Frequently Asked Questions</h1>
      <div className="faqs-list">
        {faqList.map((item, i) => (
          <div
            key={i}
            className={`faq-item ${openIndex === i ? 'open' : ''}`}
            onClick={() => toggle(i)}
          >
            <div className="faq-question">
              {item.q}
              <span className="arrow">{openIndex === i ? '▲' : '▼'}</span>
            </div>
            <div className="faq-answer">
              {item.a}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
// export default Faqs;