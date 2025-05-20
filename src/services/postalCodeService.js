const axios = require('axios');
const logger = require('../utils/logger');

class PostalCodeService {
  constructor() {
    this.apiKey = process.env.POSTAL_API_KEY;
    this.baseUrl = process.env.POSTAL_API_URL || 'https://api.postalpincode.in/pincode/';
  }

  async getLocationInfo(postalCode) {
    try {
      const response = await axios.get(`${this.baseUrl}${postalCode}`);
      
      if (response.data[0].Status === 'Success') {
        const location = response.data[0].PostOffice[0];
        return {
          city: location.District,
          state: location.State,
          country: location.Country
        };
      }
      
      throw new Error('Invalid postal code');
    } catch (error) {
      logger.error('Postal code service error:', error);
      throw new Error('Error fetching location information');
    }
  }

  validatePostalCode(postalCode) {
    // Basic validation for Indian postal codes
    const postalCodeRegex = /^[1-9][0-9]{5}$/;
    return postalCodeRegex.test(postalCode);
  }
}

module.exports = new PostalCodeService();