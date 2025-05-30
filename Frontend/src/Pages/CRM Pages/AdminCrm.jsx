import React, { useState } from 'react';
import { FiUser, FiPhone, FiMail, FiFileText, FiCheckCircle, FiClock, FiUpload, FiDownload, FiEdit2, FiTag, FiMessageSquare } from 'react-icons/fi';
import './AdminCrm.css';

const AdminCRM = () => {
  const [customers, setCustomers] = useState([
    {
      id: 'CUST-1001',
      fullName: 'Rahul Sharma',
      phone: '+91 9876543210',
      email: 'rahul@example.com',
      service: 'PAN Card',
      currentStage: 'Process',
      statusTags: ['Payment Received', 'Documents Pending'],
      remarks: {
        confirm: 'Customer verified details',
        process: 'Waiting for address proof',
        secondStage: '',
        finalStage: ''
      },
      date: '2023-05-15',
      documents: {
        uploaded: ['Aadhaar_Front.jpg'],
        required: ['Address_Proof.pdf']
      }
    },
    // More sample customers...
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newRemark, setNewRemark] = useState('');
  const [newTag, setNewTag] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const documentTypes = [
    'Aadhaar Card',
    'PAN Card',
    'Passport',
    'Voter ID',
    'Driving License',
    'Address Proof',
    'Photo',
    'Signature'
  ];

  const stages = ['Confirm', 'Process', 'Second Stage', 'Final Stage'];

  const filteredCustomers = customers.filter(customer =>
    customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateStage = (customerId, newStage) => {
    setCustomers(customers.map(customer =>
      customer.id === customerId ? { ...customer, currentStage: newStage } : customer
    ));
  };

  const addRemark = (stage) => {
    if (!newRemark.trim()) return;
    
    setCustomers(customers.map(customer =>
      customer.id === selectedCustomer.id
        ? {
            ...customer,
            remarks: {
              ...customer.remarks,
              [stage.toLowerCase().replace(' ', '')]: newRemark
            }
          }
        : customer
    ));
    setNewRemark('');
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    
    setCustomers(customers.map(customer =>
      customer.id === selectedCustomer.id
        ? {
            ...customer,
            statusTags: [...customer.statusTags, newTag]
          }
        : customer
    ));
    setNewTag('');
  };

  const requestDocument = () => {
    if (!documentType) return;
    
    setCustomers(customers.map(customer =>
      customer.id === selectedCustomer.id
        ? {
            ...customer,
            documents: {
              ...customer.documents,
              required: [...customer.documents.required, documentType]
            }
          }
        : customer
    ));
    setDocumentType('');
  };

  const removeTag = (tagToRemove) => {
    setCustomers(customers.map(customer =>
      customer.id === selectedCustomer.id
        ? {
            ...customer,
            statusTags: customer.statusTags.filter(tag => tag !== tagToRemove)
          }
        : customer
    ));
  };

  return (
    <div className="admin-crm">
      <header className="crm-header">
        <h1><FiUser /> DocNish CRM Dashboard</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="crm-container">
        {/* Customer List */}
        <div className="customer-list">
          <h2>Customer Records</h2>
          <div className="list-header">
            <span>ID</span>
            <span>Name</span>
            <span>Service</span>
            <span>Stage</span>
          </div>
          <div className="list-items">
            {filteredCustomers.map(customer => (
              <div
                key={customer.id}
                className={`customer-item ${selectedCustomer?.id === customer.id ? 'selected' : ''}`}
                onClick={() => setSelectedCustomer(customer)}
              >
                <span className="customer-id">{customer.id}</span>
                <span className="customer-name">{customer.fullName}</span>
                <span className="customer-service">{customer.service}</span>
                <span className={`customer-stage ${customer.currentStage.toLowerCase().replace(' ', '-')}`}>
                  {customer.currentStage}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Details */}
        <div className="customer-details">
          {selectedCustomer ? (
            <>
              <div className="detail-header">
                <h2>{selectedCustomer.fullName}</h2>
                <span className="customer-id">{selectedCustomer.id}</span>
              </div>

              <div className="detail-section basic-info">
                <h3><FiUser /> Basic Information</h3>
                <div className="info-grid">
                  <div>
                    <label><FiPhone /> Phone</label>
                    <p>{selectedCustomer.phone}</p>
                  </div>
                  <div>
                    <label><FiMail /> Email</label>
                    <p>{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <label><FiFileText /> Service</label>
                    <p>{selectedCustomer.service}</p>
                  </div>
                  <div>
                    <label><FiClock /> Date of Entry</label>
                    <p>{selectedCustomer.date}</p>
                  </div>
                </div>
              </div>

              <div className="detail-section stage-control">
                <h3><FiCheckCircle /> Application Stage</h3>
                <div className="stage-selector">
                  {stages.map(stage => (
                    <button
                      key={stage}
                      className={`stage-btn ${selectedCustomer.currentStage === stage ? 'active' : ''}`}
                      onClick={() => updateStage(selectedCustomer.id, stage)}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
                <div className="current-stage">
                  Current Stage: <strong>{selectedCustomer.currentStage}</strong>
                </div>
              </div>

              <div className="detail-section status-tags">
                <h3><FiTag /> Status Tags</h3>
                <div className="tags-container">
                  {selectedCustomer.statusTags.map(tag => (
                    <span key={tag} className="status-tag">
                      {tag}
                      <button onClick={() => removeTag(tag)}>×</button>
                    </span>
                  ))}
                </div>
                <div className="add-tag">
                  <input
                    type="text"
                    placeholder="Add new tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                  />
                  <button onClick={addTag}>Add</button>
                </div>
              </div>

              <div className="detail-section remarks">
                <h3><FiMessageSquare /> Remarks</h3>
                <div className="remarks-grid">
                  {Object.entries(selectedCustomer.remarks).map(([stage, remark]) => (
                    remark && (
                      <div key={stage} className="remark-item">
                        <label>{stage.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</label>
                        <p>{remark}</p>
                      </div>
                    )
                  ))}
                </div>
                <div className="add-remark">
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                  >
                    <option value="">Select stage...</option>
                    {stages.map(stage => (
                      <option key={stage} value={stage.toLowerCase().replace(' ', '')}>
                        {stage}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Add new remark..."
                    value={newRemark}
                    onChange={(e) => setNewRemark(e.target.value)}
                  />
                  <button onClick={() => addRemark(documentType)}>Add Remark</button>
                </div>
              </div>

              <div className="detail-section documents">
                <h3><FiUpload /> Documents</h3>
                <div className="documents-grid">
                  <div className="uploaded-docs">
                    <h4>Uploaded Documents</h4>
                    {selectedCustomer.documents.uploaded.length > 0 ? (
                      <ul>
                        {selectedCustomer.documents.uploaded.map((doc, index) => (
                          <li key={index}>
                            <FiDownload /> {doc}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No documents uploaded yet</p>
                    )}
                  </div>
                  <div className="required-docs">
                    <h4>Required Documents</h4>
                    {selectedCustomer.documents.required.length > 0 ? (
                      <ul>
                        {selectedCustomer.documents.required.map((doc, index) => (
                          <li key={index}>
                            <FiUpload /> {doc}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No additional documents required</p>
                    )}
                    <div className="request-doc">
                      <select
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                      >
                        <option value="">Select document type...</option>
                        {documentTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <button onClick={requestDocument}>Request Document</button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>Select a customer to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCRM;