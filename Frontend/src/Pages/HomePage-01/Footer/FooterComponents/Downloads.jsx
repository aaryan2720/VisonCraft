import React, { useState } from 'react';
import './Download.css';

function Downloads() {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback submitted:", feedback);
    setFeedback('');
    alert("Thank you for your feedback!");
  };

  return (
    <div className="download-container">
      <section className="hero">
        App showcase (device mockup)
      </section>

      <div className="platform-buttons">
        <button>App Store 🍎</button>
        <button>Google Play 📲</button>
        <button>QR Code 🧾</button>
      </div>

      <section className="features">
        <h3>Key Features</h3>
        <div className="carousel"></div>
      </section>

      <section className="reviews">
        <h3>User Reviews</h3>
        <p>⭐⭐⭐⭐⭐ - “Great App!”</p>
        <p>⭐⭐⭐⭐ - “Useful features.”</p>
      </section>

      {/* Feedback Form */}
      <section className="feedback-form">
        <h3>Leave Your Feedback</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Share your thoughts..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
          <button type="submit">Submit Feedback</button>
        </form>
      </section>
    </div>
  );
}

export default Downloads;
