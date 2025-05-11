const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

describe('API Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Auth Endpoints', () => {
    it('should rate limit excessive login attempts', async () => {
      for (let i = 0; i < 6; i++) {
        const response = await request(app)
          .post('/api/auth/login')
          .send({ email: 'test@example.com', password: 'password' });
        
        if (i === 5) {
          expect(response.status).toBe(429);
          expect(response.body.message).toContain('Too many login attempts');
        }
      }
    });
  });

  describe('API Rate Limiting', () => {
    it('should rate limit excessive API requests', async () => {
      const requests = Array(61).fill().map(() =>
        request(app).get('/api/services')
      );
      
      const responses = await Promise.all(requests);
      const lastResponse = responses[responses.length - 1];
      
      expect(lastResponse.status).toBe(429);
    });
  });

  describe('Error Handling', () => {
    it('should handle and log errors properly', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message');
    });
  });
});