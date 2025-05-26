import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCalendar, FiClock, FiUpload } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { applicationService } from '../../services/applicationService';
import './ApplyNowPage.css';

const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760; // 10MB default
const ALLOWED_FILE_TYPES = (import.meta.env.VITE_ALLOWED_FILE_TYPES || '.jpg,.jpeg,.png,.pdf,.doc,.docx').split(',');

const ApplyNowPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    postalCode: '',
    address: '',
    city: '',
    state: '',
    preferredDate: null,
    preferredTime: '',
    documents: [],
    termsAccepted: false,
    policyAccepted: false
  });
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    const fetchServiceDetails = () => {
      const allServices = [
        {
          id: 'pan',
          name: 'PAN Card',
          logo: '💳',
          fees: '₹499',
          timeRequired: '15-20 days',
          description: 'Get your PAN Card with hassle-free processing'
        },
      ];
      
      const service = allServices.find(s => s.id === serviceId);
      setServiceDetails(service);
    };
    
    fetchServiceDetails();
  }, [serviceId]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      preferredDate: date
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    
    for (const file of files) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
        continue;
      }
      
      // Check file type
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
        toast.error(`${file.name} has an unsupported file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
        continue;
      }
      
      validFiles.push(file);
    }
    
    if (validFiles.length > 0) {
      const updatedDocuments = [...formData.documents, ...validFiles];
      setFormData({
        ...formData,
        documents: updatedDocuments
      });
      toast.success(`${validFiles.length} file(s) added successfully`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Extract numeric value from fees string (e.g., "₹499" -> 499)
      const amount = parseFloat(serviceDetails.fees.replace(/[^0-9.]/g, ''));
      
      const response = await applicationService.submitApplication({
        ...formData,
        serviceId,
        amount
      });
      
      toast.success('Application submitted successfully!');
      navigate(`/applications/${response.data._id}`);
    } catch (error) {
      toast.error(error.message || 'Error submitting application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeDocument = (index) => {
    const updatedDocuments = [...formData.documents];
    updatedDocuments.splice(index, 1);
    setFormData({
      ...formData,
      documents: updatedDocuments
    });
  };

  const handlePostalCodeChange = async (e) => {
    const postalCode = e.target.value;
    setFormData({
      ...formData,
      postalCode
    });

    if (postalCode.length === 6) {
      setAddressLoading(true);
      setAddressError('');
      
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${postalCode}`);
        const data = await response.json();
        
        if (data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
          const postOffice = data[0].PostOffice[0];
          
          setFormData(prev => ({
            ...prev,
            city: postOffice.District,
            state: postOffice.State
          }));
        } else {
          setAddressError('Invalid PIN code. Please enter a valid PIN code.');
          setFormData(prev => ({
            ...prev,
            city: '',
            state: ''
          }));
        }
      } catch (error) {
        console.error('Error fetching address data:', error);
        setAddressError('Failed to fetch address. Please try again.');
      } finally {
        setAddressLoading(false);
      }
    } else if (postalCode.length > 0 && postalCode.length < 6) {
      setFormData(prev => ({
        ...prev,
        city: '',
        state: ''
      }));
    }
  };
  
  if (!serviceDetails) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading service details...</p>
      </div>
    );
  }

  return (
    <div className="apply-now-container">
      <div className="service-header">
        <div className="service-logo">
          {serviceDetails.logo}
        </div>
        <h1>Apply for {serviceDetails.name}</h1>
      </div>
      
      <form className="apply-form" onSubmit={handleSubmit}>
        {/* Personal Information Section */}
        <div className="form-section">
          <h2>Personal Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Full Name <span className="required">*</span></label>
              <input 
                type="text" 
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="form-input"
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email (Optional)</label>
              <input 
                type="email" 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number <span className="required">*</span></label>
              <div className="phone-input">
                <div className="country-code">
                  <img src="/assets/india-flag.png" alt="India" />
                  <span>+91</span>
                </div>
                <input 
                  type="tel" 
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="form-input"
                  maxLength="10"
                  placeholder="10 digit mobile number"
                  required 
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Address Information Section */}
        <div className="form-section">
          <h2>Address Information</h2>
          <div className="form-group">
            <label htmlFor="postalCode">Postal Code <span className="required">*</span></label>
            <input 
              type="text" 
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handlePostalCodeChange}
              className="form-input"
              maxLength="6"
              placeholder="Enter 6-digit PIN code"
              required 
            />
            {addressLoading && <span className="loading-text">Fetching address details...</span>}
            {addressError && <span className="error-message">{addressError}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input 
                type="text" 
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="form-input"
                readOnly={formData.postalCode.length === 6 && !addressError}
              />
            </div>
            <div className="form-group">
              <label htmlFor="state">State</label>
              <input 
                type="text" 
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="form-input"
                readOnly={formData.postalCode.length === 6 && !addressError}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address <span className="required">*</span></label>
            <textarea 
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your full address"
              required
            ></textarea>
          </div>
        </div>
        
        <div className="form-section">
          <h2><FiClock /> Schedule Our Call</h2>
          <p className="section-description">Select your preferred date and time for our executive to call you</p>
          <div className="form-row">
            <div className="form-group">
              <label>Preferred Date <span className="required">*</span></label>
              <div className="date-picker-container">
                <DatePicker
                  selected={formData.preferredDate}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                  placeholderText="Select a date"
                  className="form-input"
                  required
                />
                <FiCalendar className="date-picker-icon" />
              </div>
            </div>
            <div className="form-group">
              <label>Preferred Time <span className="required">*</span></label>
              <div className="time-picker-container">
                <input
                  type="time"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <FiClock className="time-picker-icon" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Documents Section */}
        <div className="form-section">
          <h2><FiUpload /> Required Documents (Optional)</h2>
          <p className="document-info">Upload scanned copies of required documents for faster processing</p>
          
          <div className="document-upload">
            <label className="upload-label">
              <input 
                type="file" 
                className="file-input" 
                onChange={handleFileUpload}
                multiple
              />
              <FiUpload className="upload-icon" />
              <span>Click to upload documents</span>
            </label>
          </div>
          
          {formData.documents.length > 0 && (
            <div className="document-list">
              <h3>Uploaded Documents</h3>
              <ul>
                {formData.documents.map((doc, index) => (
                  <li key={index}>
                    <span className="document-name">{doc.name}</span>
                    <button 
                      type="button" 
                      className="remove-document"
                      onClick={() => removeDocument(index)}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="form-section order-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Service Fee:</span>
            <span>{serviceDetails.fees}</span>
          </div>
          <div className="summary-row">
            <span>Processing Time:</span>
            <span>{serviceDetails.timeRequired}</span>
          </div>
          <div className="summary-row total">
            <span>Total Amount:</span>
            <span>{serviceDetails.fees}</span>
          </div>
        </div>
        
        {/* Terms and Conditions */}
        <div className="form-section terms-section">
          <div className="checkbox-group">
            <input 
              type="checkbox" 
              id="terms" 
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="terms">
              I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>
            </label>
          </div>
          <div className="checkbox-group">
            <input 
              type="checkbox" 
              id="policy" 
              name="policyAccepted"
              checked={formData.policyAccepted}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="policy">
              I have read and accept the <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            </label>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className={`submit-button ${formData.termsAccepted && formData.policyAccepted ? 'enabled' : 'disabled'}`}
            disabled={!formData.termsAccepted || !formData.policyAccepted || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Continue to Payment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyNowPage;