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
  FiSearch,
  FiX,
  FiMenu
} from 'react-icons/fi';
import './CustomerDashboard.css';
// Sidebar Component
const Sidebar = ({ activeNav, setActiveNav, isMobileOpen, setIsMobileOpen }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: FiHome },
    { id: 'documents', label: 'Documents', icon: FiFileText },
    { id: 'messages', label: 'Messages', icon: FiMessageSquare, badge: '2' },
    { id: 'invoices', label: 'Invoices', icon: FiDownload },
    { id: 'profile', label: 'Profile', icon: FiUsers },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <div className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Mobile Close Button */}
        <button 
          className="mobile-close-btn"
          onClick={() => setIsMobileOpen(false)}
        >
          <FiX size={20} />
        </button>

        {/* Logo/Brand */}
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-logo">D</div>
            <div className="brand-text">DocNish</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                setIsMobileOpen(false);
              }}
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
    </>
  );
};

// Header Component
const Header = ({ setIsMobileOpen }) => {
  return (
    <div className="main-header">
      <div className="header-left">
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileOpen(true)}
        >
          <FiMenu size={20} />
        </button>
        <div className="header-content">
          <h1 className="page-title">Customer Dashboard</h1>
          <p className="page-subtitle">
            <FiUser size={16} />
            Welcome back, Rahul Sharma
          </p>
        </div>
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
  );
};

// Stats Component
const StatsGrid = () => {
  const stats = [
    { title: 'Application Progress', value: '60%', change: '+12%', trend: 'up', icon: FiTrendingUp },
    { title: 'Documents Uploaded', value: '4/6', change: '+2', trend: 'up', icon: FiFileText },
    { title: 'Days Remaining', value: '14', change: '-3', trend: 'down', icon: FiClock },
  ];

  return (
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
  );
};

// Overview Component
const Overview = () => {
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
  };

  return (
    <div className="overview-content">
      <StatsGrid />
      
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

        {/* Sidebar Widgets */}
        <SidebarWidgets />
      </div>
    </div>
  );
};

// Documents Component
const Documents = () => {
  const [documents, setDocuments] = useState([]);
  
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setDocuments([...documents, ...files]);
  };

  const removeDocument = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  return (
    <div className="documents-content">
      <div className="page-header">
        <h2 className="section-title">Document Management</h2>
        <p className="section-subtitle">Upload and manage your application documents</p>
      </div>

      <div className="documents-grid">
        <div className="upload-section">
          <div className="upload-area">
            <label className="upload-label">
              <input 
                type="file" 
                onChange={handleFileUpload} 
                multiple 
                className="upload-input"
              />
              <FiUpload size={32} />
              <span className="upload-text">Click to upload documents</span>
              <span className="upload-subtext">Supports PDF, JPG, PNG files</span>
            </label>
          </div>
        </div>

        <div className="documents-list">
          <h3 className="list-title">Uploaded Documents ({documents.length})</h3>
          {documents.length > 0 ? (
            <div className="file-grid">
              {documents.map((doc, index) => (
                <div key={index} className="file-card">
                  <FiFileText size={24} />
                  <span className="file-name">
                    {doc.name.length > 25 ? doc.name.substring(0, 25) + '...' : doc.name}
                  </span>
                  <button 
                    onClick={() => removeDocument(index)}
                    className="remove-file-btn"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FiFileText size={48} />
              <p>No documents uploaded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Messages Component
const Messages = () => {
  const messages = [
    { id: 1, from: 'Support Team', content: 'We have received your documents and are processing them. This may take 2-3 business days.', date: '17 May', read: true, type: 'info' },
    { id: 2, from: 'Document Specialist', content: 'Please upload clearer copy of address proof. The current image is blurry.', date: '18 May', read: false, type: 'warning' },
    { id: 3, from: 'Application Team', content: 'Your application has been moved to review stage. You will receive an update within 5 business days.', date: '20 May', read: true, type: 'info' }
  ];

  return (
    <div className="messages-content">
      <div className="page-header">
        <h2 className="section-title">Messages</h2>
        <p className="section-subtitle">Communication history with our team</p>
      </div>

      <div className="messages-list">
        {messages.map(message => (
          <div key={message.id} className={`message-card ${!message.read ? 'unread' : ''}`}>
            <div className="message-header">
              <div className="message-info">
                <span className="message-from">{message.from}</span>
                <span className="message-date">{message.date}</span>
              </div>
              {!message.read && <div className="unread-indicator"></div>}
            </div>
            <p className="message-content">{message.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Invoices Component
const Invoices = () => {
  const invoices = [
    { id: 'INV-001', date: '15 May 2023', amount: '₹499', status: 'Paid', service: 'PAN Card Application' },
    { id: 'INV-002', date: '20 May 2023', amount: '₹299', status: 'Paid', service: 'Document Processing' },
    { id: 'INV-003', date: '25 May 2023', amount: '₹199', status: 'Pending', service: 'Express Service' }
  ];

  return (
    <div className="invoices-content">
      <div className="page-header">
        <h2 className="section-title">Invoices</h2>
        <p className="section-subtitle">View and download your invoices</p>
      </div>

      <div className="invoices-table">
        <div className="table-header">
          <span>Invoice ID</span>
          <span>Service</span>
          <span>Date</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Action</span>
        </div>
        {invoices.map(invoice => (
          <div key={invoice.id} className="table-row">
            <span className="invoice-id">{invoice.id}</span>
            <span>{invoice.service}</span>
            <span>{invoice.date}</span>
            <span className="amount">{invoice.amount}</span>
            <span className={`status ${invoice.status.toLowerCase()}`}>
              {invoice.status}
            </span>
            <button className="download-btn">
              <FiDownload size={14} />
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Profile Component
const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91 98765 43210',
    address: '123 Main Street, Mumbai, Maharashtra',
    panCard: 'ABCDE1234F'
  });

  return (
    <div className="profile-content">
      <div className="page-header">
        <h2 className="section-title">Profile</h2>
        <p className="section-subtitle">Manage your personal information</p>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <div className="profile-avatar">
            <FiUser size={48} />
          </div>
          <div className="profile-info">
            <h3>{profile.name}</h3>
            <p>{profile.email}</p>
            <button 
              className="edit-profile-btn"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-group">
            <label>Full Name</label>
            <input 
              type="text" 
              value={profile.name}
              disabled={!isEditing}
              className={isEditing ? 'editing' : ''}
            />
          </div>
          <div className="detail-group">
            <label>Email</label>
            <input 
              type="email" 
              value={profile.email}
              disabled={!isEditing}
              className={isEditing ? 'editing' : ''}
            />
          </div>
          <div className="detail-group">
            <label>Phone</label>
            <input 
              type="tel" 
              value={profile.phone}
              disabled={!isEditing}
              className={isEditing ? 'editing' : ''}
            />
          </div>
          <div className="detail-group">
            <label>Address</label>
            <textarea 
              value={profile.address}
              disabled={!isEditing}
              className={isEditing ? 'editing' : ''}
              rows="3"
            />
          </div>
          <div className="detail-group">
            <label>PAN Card</label>
            <input 
              type="text" 
              value={profile.panCard}
              disabled={!isEditing}
              className={isEditing ? 'editing' : ''}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar Widgets Component
const SidebarWidgets = () => {
  const [callbackRequested, setCallbackRequested] = useState(false);
  
  const requestCallback = () => {
    setCallbackRequested(true);
    setTimeout(() => setCallbackRequested(false), 3000);
  };

  const messages = [
    { id: 1, from: 'Support Team', content: 'We have received your documents and are processing them.', date: '17 May', read: true },
    { id: 2, from: 'Document Specialist', content: 'Please upload clearer copy of address proof.', date: '18 May', read: false }
  ];

  return (
    <div className="sidebar-widgets">
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
  );
};

// Main Dashboard Component
const CustomerDashboard = () => {
  const [activeNav, setActiveNav] = useState('overview');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const renderContent = () => {
    switch(activeNav) {
      case 'overview':
        return <Overview />;
      case 'documents':
        return <Documents />;
      case 'messages':
        return <Messages />;
      case 'invoices':
        return <Invoices />;
      case 'profile':
        return <Profile />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        activeNav={activeNav} 
        setActiveNav={setActiveNav}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="main-content">
        <Header setIsMobileOpen={setIsMobileOpen} />

        {/* Service Info Banner */}
        <div className="service-banner">
          <FiFileText size={24} />
          <div className="service-info">
            <h3 className="service-title">PAN Card Application</h3>
            <p className="service-details">
              Application ID: PAN2023-001234 • Status: Under Review
            </p>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="page-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;