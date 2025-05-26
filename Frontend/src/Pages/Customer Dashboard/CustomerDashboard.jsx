import React, { useState, useRef, useEffect } from 'react';
import { FiUpload, FiDownload, FiClock, FiPhone, FiMessageSquare, FiCheckCircle, FiUser, FiFileText, FiChevronRight } from 'react-icons/fi';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const [callbackRequested, setCallbackRequested] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [progressAnimated, setProgressAnimated] = useState(false);
  
  // Create refs for each section
  const statusRef = useRef(null);
  const documentsRef = useRef(null);
  const invoicesRef = useRef(null);
  const messagesRef = useRef(null);
  const helpRef = useRef(null);

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
    { id: 'INV-001', date: '15 May 2023', amount: '₹499' },
    { id: 'INV-002', date: '20 May 2023', amount: '₹299' }
  ];

  const messages = [
    { id: 1, from: 'Support Team', content: 'We have received your documents.', date: '17 May', read: true },
    { id: 2, from: 'Document Specialist', content: 'Please upload clearer copy of address proof.', date: '18 May', read: false }
  ];

  useEffect(() => {
    // Animate progress bar on component mount
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

  // Toggle section view
  const toggleSection = (section) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
      // Scroll to section if not visible
      setTimeout(() => {
        const ref = getRefForSection(section);
        if (ref.current) {
          ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 50);
    }
  };

  const getRefForSection = (section) => {
    switch(section) {
      case 'status': return statusRef;
      case 'documents': return documentsRef;
      case 'invoices': return invoicesRef;
      case 'messages': return messagesRef;
      case 'help': return helpRef;
      default: return statusRef;
    }
  };

  const isSectionExpanded = (section) => {
    return activeSection === section;
  };

  return (
    <div className="dashboard-container">
      {/* Navigation Menu */}
      <nav className="dashboard-nav">
        <button 
          onClick={() => toggleSection('status')}
          className={activeSection === 'status' ? 'active' : ''}
        >
          <FiCheckCircle /> Status
        </button>
        <button 
          onClick={() => toggleSection('documents')}
          className={activeSection === 'documents' ? 'active' : ''}
        >
          <FiUpload /> Documents
        </button>
        <button 
          onClick={() => toggleSection('invoices')}
          className={activeSection === 'invoices' ? 'active' : ''}
        >
          <FiDownload /> Invoices
        </button>
        <button 
          onClick={() => toggleSection('messages')}
          className={activeSection === 'messages' ? 'active' : ''}
        >
          <FiMessageSquare /> Messages
        </button>
        <button 
          onClick={() => toggleSection('help')}
          className={activeSection === 'help' ? 'active' : ''}
        >
          <FiPhone /> Help
        </button>
      </nav>

      <div className="dashboard-header">
        <h1><FiUser /> Welcome, Rahul Sharma</h1>
        <p className="service-name"><FiFileText /> PAN Card Application</p>
      </div>

      {/* Dashboard Overview - All cards in one view */}
      <div className="dashboard-overview">
        {/* Status Card */}
        <div 
          ref={statusRef} 
          className={`dashboard-card status-card ${isSectionExpanded('status') ? 'expanded' : ''}`}
          onClick={() => toggleSection('status')}
        >
          <div className="card-header">
            <h3><FiCheckCircle /> Application Status</h3>
            <FiChevronRight className={`expand-icon ${isSectionExpanded('status') ? 'expanded' : ''}`} />
          </div>
          
          <div className="card-content">
            <div className="status-badge-container">
              <div className="status-badge">{serviceStatus.status}</div>
              {serviceStatus.documentsNeeded && (
                <div className="documents-needed-badge">Documents Required</div>
              )}
            </div>
            
            <div className="progress-container">
              <div className="progress-text">
                Step {serviceStatus.currentStep} of {serviceStatus.totalSteps}
              </div>
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${progressAnimated ? 'animated' : ''}`}
                  style={{ width: `${(serviceStatus.currentStep / serviceStatus.totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {isSectionExpanded('status') && (
            <div className="expanded-content">
              <div className="timeline">
                {serviceStatus.steps.map(step => (
                  <div key={step.id} className={`timeline-item ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}`}>
                    <div className="timeline-marker">
                      {step.completed ? <FiCheckCircle /> : step.current ? <div className="current-marker"></div> : <div className="pending-marker"></div>}
                    </div>
                    <div className="timeline-content">
                      <h4>{step.name}</h4>
                      {step.date && <p>{step.date}</p>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="completion-date">
                <FiClock /> Estimated Completion: {serviceStatus.estimatedCompletion}
              </div>
            </div>
          )}
        </div>

        {/* Documents Card */}
        <div 
          ref={documentsRef} 
          className={`dashboard-card documents-card ${isSectionExpanded('documents') ? 'expanded' : ''}`}
          onClick={() => toggleSection('documents')}
        >
          <div className="card-header">
            <h3><FiUpload /> Documents</h3>
            <FiChevronRight className={`expand-icon ${isSectionExpanded('documents') ? 'expanded' : ''}`} />
          </div>
          
          <div className="card-content">
            <div className="upload-summary">
              <div className="upload-count">
                {documents.length} {documents.length === 1 ? 'document' : 'documents'} uploaded
              </div>
              <div className="upload-action">
                <FiUpload /> Upload
              </div>
            </div>
          </div>

          {isSectionExpanded('documents') && (
            <div className="expanded-content">
              <div className="upload-area">
                <label className="upload-label">
                  <input type="file" onChange={handleFileUpload} multiple />
                  <FiUpload className="upload-icon" />
                  <span>Click to Upload Documents</span>
                  <p className="upload-hint">(You can upload multiple files at once)</p>
                </label>
              </div>
              
              {documents.length > 0 && (
                <div className="uploaded-files">
                  <h4>Uploaded Files:</h4>
                  <ul>
                    {documents.map((doc, index) => (
                      <li key={index}>
                        <span>{doc.name}</span>
                        <button onClick={(e) => { e.stopPropagation(); removeDocument(index); }}>×</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="required-documents">
                <h4>Documents Needed:</h4>
                <ul>
                  <li>Aadhaar Card (Front & Back)</li>
                  <li>Passport Photo</li>
                  <li>Signature Proof</li>
                  <li>Address Proof</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Invoices Card */}
        <div 
          ref={invoicesRef} 
          className={`dashboard-card invoices-card ${isSectionExpanded('invoices') ? 'expanded' : ''}`}
          onClick={() => toggleSection('invoices')}
        >
          <div className="card-header">
            <h3><FiDownload /> Payment Receipts</h3>
            <FiChevronRight className={`expand-icon ${isSectionExpanded('invoices') ? 'expanded' : ''}`} />
          </div>
          
          <div className="card-content">
            <div className="invoices-summary">
              <div className="invoice-count">
                {invoices.length} {invoices.length === 1 ? 'invoice' : 'invoices'} available
              </div>
              <div className="total-amount">
                <FaIndianRupeeSign /> 798 total
              </div>
            </div>
          </div>

          {isSectionExpanded('invoices') && (
            <div className="expanded-content">
              {invoices.map(invoice => (
                <div key={invoice.id} className="invoice-item">
                  <div className="invoice-info">
                    <h4>Invoice #{invoice.id}</h4>
                    <p>Date: {invoice.date}</p>
                  </div>
                  <div className="invoice-amount">
                    <FaIndianRupeeSign /> {invoice.amount}
                  </div>
                  <button className="download-btn" onClick={(e) => e.stopPropagation()}>
                    <FiDownload /> Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Messages Card */}
        <div 
          ref={messagesRef} 
          className={`dashboard-card messages-card ${isSectionExpanded('messages') ? 'expanded' : ''}`}
          onClick={() => toggleSection('messages')}
        >
          <div className="card-header">
            <h3><FiMessageSquare /> Messages</h3>
            <FiChevronRight className={`expand-icon ${isSectionExpanded('messages') ? 'expanded' : ''}`} />
          </div>
          
          <div className="card-content">
            <div className="messages-summary">
              <div className="unread-count">
                {messages.filter(m => !m.read).length} unread
              </div>
              <div className="latest-message">
                Latest: {messages[0].from} - {messages[0].content.substring(0, 30)}...
              </div>
            </div>
          </div>

          {isSectionExpanded('messages') && (
            <div className="expanded-content">
              {messages.map(message => (
                <div key={message.id} className={`message-item ${!message.read ? 'unread' : ''}`}>
                  <div className="message-header">
                    <div>
                      <h4>{message.from}</h4>
                      <p>{message.content}</p>
                    </div>
                    <div className="message-meta">
                      <span>{message.date}</span>
                      {!message.read && <span className="new-badge">New</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Card */}
        <div 
          ref={helpRef} 
          className={`dashboard-card help-card ${isSectionExpanded('help') ? 'expanded' : ''}`}
          onClick={() => toggleSection('help')}
        >
          <div className="card-header">
            <h3><FiPhone /> Need Help?</h3>
            <FiChevronRight className={`expand-icon ${isSectionExpanded('help') ? 'expanded' : ''}`} />
          </div>
          
          <div className="card-content">
            <div className="help-summary">
              Click to request callback or view contact information
            </div>
          </div>

          {isSectionExpanded('help') && (
            <div className="expanded-content">
              <p>Our team is ready to assist you with your application</p>
              <button 
                className={`help-button ${callbackRequested ? 'requested' : ''}`}
                onClick={(e) => { e.stopPropagation(); requestCallback(); }}
                disabled={callbackRequested}
              >
                <FiPhone /> {callbackRequested ? 'We Will Call You Soon' : 'Request Callback'}
              </button>
              <div className="contact-info">
                <p>Or call us directly:</p>
                <h3>+91 1800 123 4567</h3>
                <p>Available 9AM-6PM, Monday to Saturday</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;