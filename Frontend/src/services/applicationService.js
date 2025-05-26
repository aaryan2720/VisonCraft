import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const submitApplication = async (formData) => {
  try {
    // Create a FormData object to handle file uploads
    const data = new FormData();
    
    // Append all form fields
    data.append('serviceId', formData.serviceId);
    data.append('fullName', formData.fullName);
    data.append('email', formData.email);
    data.append('phoneNumber', formData.phoneNumber);
    data.append('postalCode', formData.postalCode);
    data.append('address', formData.address);
    data.append('city', formData.city);
    data.append('state', formData.state);
    data.append('preferredDate', formData.preferredDate.toISOString());
    data.append('preferredTime', formData.preferredTime);
    data.append('amount', formData.amount);

    // Append each document file
    formData.documents.forEach((file, index) => {
      data.append('documents', file);
    });

    const response = await axios.post(`${API_URL}/applications`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error submitting application');
  }
};

const getApplicationStatus = async (applicationId) => {
  try {
    const response = await axios.get(`${API_URL}/applications/${applicationId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching application status');
  }
};

export const applicationService = {
  submitApplication,
  getApplicationStatus
};