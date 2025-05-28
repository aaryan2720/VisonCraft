import React, { useState, useRef, useEffect } from 'react';
import { 
  FiUpload, 
  FiDownload, 
  FiClock, 
  FiPhone, 
  FiMessageSquare, 
  FiCheckCircle, 
  FiUser, 
  FiFileText, 
  FiChevronRight,
  FiHome,
  FiSettings,
  FiHelpCircle,
  FiUsers,
  FiTrendingUp,
  FiBell,
  FiSearch
} from 'react-icons/fi';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const [callbackRequested, setCallbackRequested] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [activeNav, setActiveNav] = useState('overview');
  const [progressAnimated, setProgressAnimated] = useState(false);
  
  // Mock data
  const serviceStatus = {
    currentStep: 3,
    totalSteps: 5,
    status: 'Under Review',
    steps: [
      { id: 1, name: 'Application Submitted', completed: true, date: '15 May 2023' },
      { id: 2, name: 'Document Verification', completed: true, date: '17 May 2023' },
      { id: 3, name: 'Under Review', completed: false, current: true },
      { id: 4, name: 'Approval', completed: false },
      { id: 5, name: 'Delivery', completed: false }
    ],
    estimatedCompletion: '10 June 2023',
    documentsNeeded: true
  };

  const invoices = [
    { id: 'INV-001', date: '15 May 2023', amount: '₹499', status: 'Paid' },
    { id: 'INV-002', date: '20 May 2023', amount: '₹299', status: 'Paid' }
  ];

  const messages = [
    { id: 1, from: 'Support Team', content: 'We have received your documents and are processing them.', date: '17 May', read: true, type: 'info' },
    { id: 2, from: 'Document Specialist', content: 'Please upload clearer copy of address proof.', date: '18 May', read: false, type: 'warning' }
  ];

  const stats = [
    { title: 'Application Progress', value: '60%', change: '+12%', trend: 'up', icon: FiTrendingUp },
    { title: 'Documents Uploaded', value: '4/6', change: '+2', trend: 'up', icon: FiFileText },
    { title: 'Days Remaining', value: '14', change: '-3', trend: 'down', icon: FiClock },
  ];

  const navItems = [
    { id: 'overview', label: 'Overview', icon: FiHome },
    { id: 'documents', label: 'Documents', icon: FiFileText },
    { id: 'messages', label: 'Messages', icon: FiMessageSquare, badge: '2' },
    { id: 'invoices', label: 'Invoices', icon: FiDownload },
    { id: 'customers', label: 'Profile', icon: FiUsers },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressAnimated(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setDocuments([...documents, ...files]);
  };

  const removeDocument = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const requestCallback = () => {
    setCallbackRequested(true);
    setTimeout(() => setCallbackRequested(false), 3000);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        {/* Logo/Brand */}
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-logo">@</div>
            <div className="brand-text">Your Company</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
            >
              <item.icon size={18} />
              {item.label}
              {item.badge && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="sidebar-footer">
          <button className="sidebar-footer-btn">
            <FiSettings size={18} />
            Settings
          </button>
          <button className="sidebar-footer-btn">
            <FiHelpCircle size={18} />
            Help
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="main-header">
          <div className="header-content">
            <h1 className="page-title">Customer Dashboard</h1>
            <p className="page-subtitle">
              <FiUser size={16} />
              Welcome back, Rahul Sharma
            </p>
          </div>
          
          <div className="header-actions">
            <button className="header-btn">
              <FiSearch size={18} />
            </button>
            <button className="header-btn notification-btn">
              <FiBell size={18} />
              <span className="notification-dot"></span>
            </button>
          </div>
        </div>

        {/* Service Info Banner */}
        <div className="service-banner">
          <FiFileText size={24} />
          <div className="service-info">
            <h3 className="service-title">PAN Card Application</h3>
            <p className="service-details">
              Application ID: PAN2023-001234 • Status: {serviceStatus.status}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">
                <stat.icon size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">{stat.title}</div>
                <div className="stat-value">{stat.value}</div>
                <div className={`stat-change ${stat.trend}`}>
                  <FiTrendingUp size={12} />
                  {stat.change} this week
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Application Progress */}
          <div className="progress-card">
            <div className="card-header">
              <h3 className="card-title">Application Progress</h3>
              <button className="view-details-btn">View Details</button>
            </div>

            {/* Progress Timeline */}
            <div className="timeline">
              {serviceStatus.steps.map((step, index) => (
                <div key={step.id} className="timeline-item">
                  {/* Timeline Line */}
                  {index < serviceStatus.steps.length - 1 && (
                    <div className={`timeline-line ${step.completed ? 'completed' : ''}`}></div>
                  )}
                  
                  {/* Step Marker */}
                  <div className={`timeline-marker ${step.completed ? 'completed' : step.current ? 'current' : 'pending'}`}>
                    {step.completed ? (
                      <FiCheckCircle size={14} />
                    ) : step.current ? (
                      <div className="current-dot"></div>
                    ) : null}
                  </div>
                  
                  {/* Step Content */}
                  <div className="timeline-content">
                    <h4 className={`step-name ${step.completed || step.current ? 'active' : ''}`}>
                      {step.name}
                    </h4>
                    {step.date && (
                      <p className="step-date">{step.date}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="completion-info">
              <FiClock size={16} />
              <span>Estimated Completion: {serviceStatus.estimatedCompletion}</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="sidebar-widgets">
            {/* Document Upload */}
            <div className="widget-card">
              <h3 className="widget-title">Document Upload</h3>
              
              <div className="upload-area">
                <label className="upload-label">
                  <input 
                    type="file" 
                    onChange={handleFileUpload} 
                    multiple 
                    className="upload-input"
                  />
                  <FiUpload size={24} />
                  <span className="upload-text">Click to upload</span>
                </label>
              </div>

              {documents.length > 0 && (
                <div className="uploaded-files">
                  <h4 className="files-title">Uploaded Files ({documents.length})</h4>
                  {documents.slice(0, 3).map((doc, index) => (
                    <div key={index} className="file-item">
                      <span className="file-name">
                        {doc.name.length > 20 ? doc.name.substring(0, 20) + '...' : doc.name}
                      </span>
                      <button 
                        onClick={() => removeDocument(index)}
                        className="remove-file-btn"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Messages */}
            <div className="widget-card">
              <div className="widget-header">
                <h3 className="widget-title">Recent Messages</h3>
                <span className="unread-badge">
                  {messages.filter(m => !m.read).length} new
                </span>
              </div>

              {messages.slice(0, 2).map(message => (
                <div key={message.id} className="message-item">
                  <div className="message-header">
                    <span className="message-from">{message.from}</span>
                    <span className="message-date">{message.date}</span>
                  </div>
                  <p className="message-content">
                    {message.content.length > 60 
                      ? message.content.substring(0, 60) + '...' 
                      : message.content}
                  </p>
                  {!message.read && <div className="unread-indicator"></div>}
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="widget-card">
              <h3 className="widget-title">Quick Actions</h3>
              
              <button 
                onClick={requestCallback}
                disabled={callbackRequested}
                className={`callback-btn ${callbackRequested ? 'requested' : ''}`}
              >
                <FiPhone size={16} />
                {callbackRequested ? 'Callback Requested' : 'Request Callback'}
              </button>

              <div className="contact-info">
                <p className="contact-text">Or call us directly:</p>
                <strong className="contact-number">+91 1800 123 4567</strong>
                <p className="contact-hours">Mon-Sat, 9AM-6PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;