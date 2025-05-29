import React from "react";
import "./Career.css";

function Header() {
  return (
    <header>
      <div className="header-container">
        <h1>DOCNISH</h1>
        <div className="menu-lines">
          <span className="menu-line"></span>
          <span className="menu-line"></span>
          <span className="menu-line"></span>
        </div>
      </div>
    </header>
  );
}

function Banner() {
  return (
    <section className="banner">
      <h2>JOIN OUR TEAM</h2>
      <p>Be part of a dynamic workplace where innovation thrives</p>
    </section>
  );
}

function JobCard({ title, description, requirements }) {
  const handleApply = () => {
    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <div className="job-card">
      <h4>{title}</h4>
      <p>{description}</p>
      <ul>
        {requirements.map((req, index) => (
          <li key={index}>{req}</li>
        ))}
      </ul>
      <button onClick={handleApply}>Apply Now</button>
    </div>
  );
}

function JobOpenings() {
  const jobs = [
    {
      title: "Frontend Developer",
      description: "Build UI using React and CSS.",
      requirements: [
        "3+ years experience",
        "Proficient in React",
        "Strong UI/UX sense",
      ],
    },
    {
      title: "Backend Developer",
      description: "Develop backend services using Node.js.",
      requirements: [
        "5+ years experience",
        "Expert in Node.js and MongoDB",
        "REST API knowledge",
      ],
    },
    {
      title: "DevOps Engineer",
      description: "Manage CI/CD and cloud infrastructure.",
      requirements: [
        "Knowledge of AWS & Docker",
        "Experience with Jenkins",
        "Infra as Code tools",
      ],
    },
    {
      title: "QA Tester",
      description: "Ensure software quality through testing.",
      requirements: [
        "Manual and automation testing",
        "Familiar with Selenium",
        "Strong reporting skills",
      ],
    },
  ];

  return (
    <section>
      <h3 style={{ textAlign: "center" }}>Current Openings</h3>
      <div className="filters">
        <div className="filter-group">
          <label>Department</label>
          <select>
            <option>ALL DEPARTMENTS</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Location</label>
          <select>
            <option>ALL LOCATIONS</option>
          </select>
        </div>
      </div>
      <div className="jobs-grid">
        {jobs.map((job, index) => (
          <JobCard
            key={index}
            title={job.title}
            description={job.description}
            requirements={job.requirements}
          />
        ))}
      </div>
    </section>
  );
}

function Career() {
  return (
    <div>
      <Header />
      <main className="main">
        <Banner />
        <JobOpenings />
      </main>
    </div>
  );
}

export default Career;