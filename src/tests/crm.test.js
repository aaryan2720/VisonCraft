const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const { CRM } = require('../models/crm');
const { User } = require('../models/user');
const jwt = require('jsonwebtoken');

describe('CRM API Tests', () => {
  let userToken;
  let testCRM;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Create test user
    const user = await User.create({
      email: 'user@test.com',
      password: 'password123',
      role: 'user',
      name: 'Test User'
    });

    userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await CRM.deleteMany({});
    await mongoose.connection.close();
  });

  describe('CRM Operations', () => {
    it('should create a new CRM entry', async () => {
      const response = await request(app)
        .post('/api/crm')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          customerName: 'Test Customer',
          email: 'customer@test.com',
          phone: '1234567890',
          inquiry: 'Test inquiry',
          status: 'new'
        });

      expect(response.status).toBe(201);
      expect(response.body.customerName).toBe('Test Customer');
      testCRM = response.body;
    });

    it('should get all CRM entries', async () => {
      const response = await request(app)
        .get('/api/crm')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get a specific CRM entry by id', async () => {
      const response = await request(app)
        .get(`/api/crm/${testCRM._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(testCRM._id);
    });

    it('should update CRM entry status', async () => {
      const response = await request(app)
        .patch(`/api/crm/${testCRM._id}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          status: 'in-progress',
          note: 'Status update test'
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('in-progress');
    });

    it('should add notes to CRM entry', async () => {
      const response = await request(app)
        .post(`/api/crm/${testCRM._id}/notes`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          note: 'Test note',
          type: 'general'
        });

      expect(response.status).toBe(200);
      expect(response.body.notes).toHaveLength(1);
      expect(response.body.notes[0].note).toBe('Test note');
    });

    it('should resolve a CRM entry', async () => {
      const response = await request(app)
        .post(`/api/crm/${testCRM._id}/resolve`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          resolution: 'Test resolution',
          feedback: 'Test feedback'
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('resolved');
      expect(response.body.resolution).toBe('Test resolution');
    });

    it('should not allow access without authentication', async () => {
      const response = await request(app)
        .get('/api/crm');

      expect(response.status).toBe(401);
    });
  });
});