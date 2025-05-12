const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const { Service, Category } = require('../models/service');
const { User } = require('../models/user');
const jwt = require('jsonwebtoken');

describe('Services API Tests', () => {
  let adminToken;
  let userToken;
  let testCategory;
  let testService;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Create test admin user
    const adminUser = await User.create({
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
      name: 'Test Admin'
    });
    
    // Create test regular user
    const regularUser = await User.create({
      email: 'user@test.com',
      password: 'password123',
      role: 'user',
      name: 'Test User'
    });

    adminToken = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET);
    userToken = jwt.sign({ id: regularUser._id }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Category.deleteMany({});
    await Service.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Category Endpoints', () => {
    it('should create a new category (admin only)', async () => {
      const response = await request(app)
        .post('/api/services/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Category',
          description: 'Test Category Description'
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Test Category');
      testCategory = response.body;
    });

    it('should not allow regular users to create categories', async () => {
      const response = await request(app)
        .post('/api/services/categories')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'User Category',
          description: 'Should Not Work'
        });

      expect(response.status).toBe(403);
    });

    it('should get all categories', async () => {
      const response = await request(app)
        .get('/api/services/categories');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Service Endpoints', () => {
    it('should create a new service (admin only)', async () => {
      const response = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Service',
          description: 'Test Service Description',
          category: testCategory._id,
          price: 99.99,
          duration: 60
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Test Service');
      testService = response.body;
    });

    it('should get all services', async () => {
      const response = await request(app)
        .get('/api/services');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get a service by id', async () => {
      const response = await request(app)
        .get(`/api/services/${testService._id}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(testService._id);
    });

    it('should update a service (admin only)', async () => {
      const response = await request(app)
        .patch(`/api/services/${testService._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 149.99
        });

      expect(response.status).toBe(200);
      expect(response.body.price).toBe(149.99);
    });

    it('should delete a service (admin only)', async () => {
      const response = await request(app)
        .delete(`/api/services/${testService._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);

      const checkDeleted = await request(app)
        .get(`/api/services/${testService._id}`);
      expect(checkDeleted.status).toBe(404);
    });

    it('should handle bulk status updates (admin only)', async () => {
      const services = await Service.create([
        {
          name: 'Bulk Test 1',
          description: 'Test 1',
          category: testCategory._id,
          price: 99.99,
          duration: 60
        },
        {
          name: 'Bulk Test 2',
          description: 'Test 2',
          category: testCategory._id,
          price: 149.99,
          duration: 90
        }
      ]);

      const response = await request(app)
        .patch('/api/services/bulk/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          serviceIds: services.map(s => s._id),
          status: 'inactive'
        });

      expect(response.status).toBe(200);
      expect(response.body.modifiedCount).toBe(2);
    });
  });
});