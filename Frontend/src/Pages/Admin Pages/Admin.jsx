// AdminServices.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './Admin.css';

// Predefined categories
export const filters = [
  { id: 'all', name: 'All Documents', icon: '🔍' },
  { id: 'identity', name: 'Identity Documents', icon: '🪪' },
  { id: 'financial', name: 'Financial Documents', icon: '💰' },
  { id: 'education', name: 'Education Documents', icon: '🎓' },
  { id: 'property', name: 'Property Documents', icon: '🏠' }
];

const Admin = () => {
  const [services, setServices] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('service');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchServices();
    fetchCustomFilters();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setIsLoading(false);
    }
  };

  const fetchCustomFilters = async () => {
    try {
      const response = await fetch('/api/filters');
      const data = await response.json();
      setCustomFilters(data);
    } catch (error) {
      console.error('Error fetching custom filters:', error);
    }
  };

  // Combine predefined and custom filters
  const allFilters = [...filters, ...customFilters];

  const onSubmitService = async (data) => {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          requiredDocuments: data.requiredDocumentsStr 
            ? data.requiredDocumentsStr.split(',').map(doc => doc.trim())
            : []
        }),
      });
      const newService = await response.json();
      setServices([...services, newService]);
      reset();
      // Show success message or feedback
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  const onSubmitFilter = async (data) => {
    try {
      const response = await fetch('/api/filters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const newFilter = await response.json();
      setCustomFilters([...customFilters, newFilter]);
      reset();
      // Show success message or feedback
    } catch (error) {
      console.error('Error adding filter:', error);
    }
  };

  const deleteService = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await fetch(`/api/services/${id}`, { method: 'DELETE' });
        setServices(services.filter(s => s.id !== id));
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const deleteFilter = async (id) => {
    if (window.confirm('Are you sure you want to delete this filter?')) {
      try {
        await fetch(`/api/filters/${id}`, { method: 'DELETE' });
        setCustomFilters(customFilters.filter(f => f.id !== id));
      } catch (error) {
        console.error('Error deleting filter:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="admin-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1 className="admin-title">
          <span className="title-icon">⚙️</span>
          Admin Dashboard
        </h1>
        <p className="admin-subtitle">Manage services and filters</p>
      </header>

      {/* Navigation Tabs */}
      <nav className="admin-nav">
        <button 
          className={`nav-tab ${activeSection === 'service' ? 'active' : ''}`}
          onClick={() => setActiveSection('service')}
        >
          <span className="tab-icon">🛠️</span>
          Add Service
        </button>
        <button 
          className={`nav-tab ${activeSection === 'filter' ? 'active' : ''}`}
          onClick={() => setActiveSection('filter')}
        >
          <span className="tab-icon">🔍</span>
          Add Filter
        </button>
        <button 
          className={`nav-tab ${activeSection === 'view' ? 'active' : ''}`}
          onClick={() => setActiveSection('view')}
        >
          <span className="tab-icon">📋</span>
          View All
        </button>
      </nav>

      {/* Add Service Section */}
      {activeSection === 'service' && (
        <section className="admin-section">
          <div className="section-header">
            <h2 className="section-title">Add New Service</h2>
            <p className="section-description">Create a new service offering</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmitService)} className="admin-form">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Service ID</label>
                <input 
                  {...register('id', { required: 'Service ID is required' })} 
                  className={`form-input ${errors.id ? 'error' : ''}`}
                  placeholder="e.g., passport-renewal"
                />
                {errors.id && <span className="error-message">{errors.id.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Service Name</label>
                <input 
                  {...register('name', { required: 'Service name is required' })} 
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Internal service name"
                />
                {errors.name && <span className="error-message">{errors.name.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Display Name</label>
                <input 
                  {...register('displayName', { required: 'Display name is required' })} 
                  className={`form-input ${errors.displayName ? 'error' : ''}`}
                  placeholder="Public facing name"
                />
                {errors.displayName && <span className="error-message">{errors.displayName.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  {...register('category', { required: 'Category is required' })} 
                  className={`form-select ${errors.category ? 'error' : ''}`}
                >
                  <option value="">Select a category</option>
                  {allFilters.map(filter => (
                    <option key={filter.id} value={filter.id}>{filter.name}</option>
                  ))}
                </select>
                {errors.category && <span className="error-message">{errors.category.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Fees</label>
                <input 
                  {...register('fees', { required: 'Fees information is required' })} 
                  className={`form-input ${errors.fees ? 'error' : ''}`}
                  placeholder="e.g., ₹500 or Free"
                />
                {errors.fees && <span className="error-message">{errors.fees.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Time Required</label>
                <input 
                  {...register('timeRequired', { required: 'Time requirement is required' })} 
                  className={`form-input ${errors.timeRequired ? 'error' : ''}`}
                  placeholder="e.g., 2-3 weeks"
                />
                {errors.timeRequired && <span className="error-message">{errors.timeRequired.message}</span>}
              </div>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Description</label>
              <textarea 
                {...register('description', { required: 'Description is required' })} 
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Detailed description of the service"
                rows="4"
              />
              {errors.description && <span className="error-message">{errors.description.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Logo (Emoji)</label>
              <input 
                {...register('logo', { required: 'Logo is required' })} 
                className={`form-input ${errors.logo ? 'error' : ''}`}
                placeholder="📄"
                maxLength="2"
              />
              {errors.logo && <span className="error-message">{errors.logo.message}</span>}
            </div>

            <div className="form-group full-width">
              <label className="form-label">Required Documents</label>
              <textarea 
                {...register('requiredDocumentsStr')} 
                className="form-textarea"
                placeholder="Enter documents separated by commas (e.g., Aadhaar Card, PAN Card, Passport Photos)"
                rows="3"
              />
              <small className="form-help">Separate multiple documents with commas</small>
            </div>

            <button type="submit" className="btn-primary">
              <span className="btn-icon">✅</span>
              Add Service
            </button>
          </form>
        </section>
      )}

      {/* Add Filter Section */}
      {activeSection === 'filter' && (
        <section className="admin-section">
          <div className="section-header">
            <h2 className="section-title">Add New Filter</h2>
            <p className="section-description">Create a new category filter</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmitFilter)} className="admin-form">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Filter ID</label>
                <input 
                  {...register('id', { required: 'Filter ID is required' })} 
                  className={`form-input ${errors.id ? 'error' : ''}`}
                  placeholder="e.g., government-services"
                />
                {errors.id && <span className="error-message">{errors.id.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Filter Name</label>
                <input 
                  {...register('name', { required: 'Filter name is required' })} 
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="e.g., Government Services"
                />
                {errors.name && <span className="error-message">{errors.name.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Icon (Emoji)</label>
                <input 
                  {...register('icon', { required: 'Icon is required' })} 
                  className={`form-input ${errors.icon ? 'error' : ''}`}
                  placeholder="🏛️"
                  maxLength="2"
                />
                {errors.icon && <span className="error-message">{errors.icon.message}</span>}
              </div>
            </div>

            <button type="submit" className="btn-primary">
              <span className="btn-icon">✅</span>
              Add Filter
            </button>
          </form>
        </section>
      )}

      {/* View All Section */}
      {activeSection === 'view' && (
        <section className="admin-section">
          <div className="section-header">
            <h2 className="section-title">Current Services & Filters</h2>
            <p className="section-description">Manage existing items</p>
          </div>

          {/* Services List */}
          <div className="data-section">
            <h3 className="data-title">Services ({services.length})</h3>
            <div className="cards-grid">
              {services.map(service => (
                <div key={service.id} className="service-card">
                  <div className="card-header">
                    <div className="card-title">
                      <span className="card-logo">{service.logo}</span>
                      <h4>{service.displayName}</h4>
                    </div>
                    <button 
                      onClick={() => deleteService(service.id)}
                      className="btn-delete"
                      title="Delete service"
                    >
                      🗑️
                    </button>
                  </div>
                  <p className="card-description">{service.description}</p>
                  <div className="card-details">
                    <div className="detail-item">
                      <strong>Fees:</strong> {service.fees}
                    </div>
                    <div className="detail-item">
                      <strong>Time:</strong> {service.timeRequired}
                    </div>
                  </div>
                  {service.requiredDocuments && service.requiredDocuments.length > 0 && (
                    <div className="required-docs">
                      <strong>Required Documents:</strong>
                      <ul className="docs-list">
                        {service.requiredDocuments.map((doc, i) => (
                          <li key={i}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Filters List */}
          <div className="data-section">
            <h3 className="data-title">Predefined Categories ({filters.length})</h3>
            <div className="cards-grid">
              {filters.map(filter => (
                <div key={filter.id} className="filter-card predefined">
                  <div className="card-header">
                    <div className="card-title">
                      <span className="card-logo">{filter.icon}</span>
                      <h4>{filter.name}</h4>
                    </div>
                    <span className="predefined-badge">Built-in</span>
                  </div>
                  <p className="filter-id">ID: {filter.id}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Filters List */}
          <div className="data-section">
            <h3 className="data-title">Custom Filters ({customFilters.length})</h3>
            <div className="cards-grid">
              {customFilters.map(filter => (
                <div key={filter.id} className="filter-card">
                  <div className="card-header">
                    <div className="card-title">
                      <span className="card-logo">{filter.icon}</span>
                      <h4>{filter.name}</h4>
                    </div>
                    <button 
                      onClick={() => deleteFilter(filter.id)}
                      className="btn-delete"
                      title="Delete filter"
                    >
                      🗑️
                    </button>
                  </div>
                  <p className="filter-id">ID: {filter.id}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Admin;