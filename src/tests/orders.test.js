const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const { Order } = require('../models/order');
const { User } = require('../models/user');
const jwt = require('jsonwebtoken');

describe('Orders API Tests', () => {
  let userToken;
  let testOrder;

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
    await Order.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Order Operations', () => {
    it('should create a new order', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          services: [
            {
              serviceId: new mongoose.Types.ObjectId(),
              quantity: 1,
              price: 99.99
            }
          ],
          totalAmount: 99.99,
          status: 'pending'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('services');
      expect(response.body.status).toBe('pending');
      testOrder = response.body;
    });

    it('should get all orders for authenticated user', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get a specific order by id', async () => {
      const response = await request(app)
        .get(`/api/orders/${testOrder._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(testOrder._id);
    });

    it('should update order status', async () => {
      const response = await request(app)
        .patch(`/api/orders/${testOrder._id}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          status: 'completed'
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('completed');
    });

    it('should not allow access to orders without authentication', async () => {
      const response = await request(app)
        .get('/api/orders');

      expect(response.status).toBe(401);
    });

    it('should not allow access to another user\'s order', async () => {
      // Create another user
      const anotherUser = await User.create({
        email: 'another@test.com',
        password: 'password123',
        role: 'user',
        name: 'Another User'
      });
      const anotherToken = jwt.sign({ id: anotherUser._id }, process.env.JWT_SECRET);

      const response = await request(app)
        .get(`/api/orders/${testOrder._id}`)
        .set('Authorization', `Bearer ${anotherToken}`);

      expect(response.status).toBe(403);
    });
  });
});