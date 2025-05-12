const mongoose = require('mongoose');
const { User } = require('../models/User');
const { Category, Service } = require('../models/Service');
const Order = require('../models/Order');
const { mockUsers, mockCategories, mockServices, mockOrders } = require('./mockData');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/visioncraft', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Service.deleteMany({}),
      Order.deleteMany({})
    ]);

    // Insert users
    const users = await User.create(
      mockUsers.map(user => ({
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ')[1] || '',
        email: user.email,
        password: user.password,
        role: user.role === 'admin' ? 'admin' : 'user',
        phone: user.phone,
        address: {
          street: user.address.split(',')[0].trim(),
          city: user.address.split(',')[1].trim()
        },
        createdAt: user.createdAt
      }))
    );

    // Insert categories
    const categories = await Category.create(
      mockCategories.map(category => ({
        _id: category._id,
        name: category.name,
        description: category.description,
        active: category.status === 'active'
      }))
    );

    // Insert services
    const services = await Service.create(
      mockServices.map(service => ({
        name: service.name,
        description: service.description,
        category: service.category,
        price: service.price,
        duration: service.duration,
        active: service.status === 'active',
        features: service.features.map(feature => ({
          name: feature,
          included: true
        }))
      }))
    );

    // Insert orders
    const orders = await Order.create(
      mockOrders.map((order, index) => ({
        customer: users[index]._id,
        services: order.services.map(service => ({
          service: services[0]._id,
          quantity: service.quantity,
          price: service.price
        })),
        status: order.status,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus === 'awaiting' ? 'unpaid' : order.paymentStatus,
        paymentMethod: 'credit-card',
        scheduledDate: order.scheduledDate
      }))
    );

    console.log('Database seeded successfully!');
    console.log(`Inserted ${users.length} users`);
    console.log(`Inserted ${categories.length} categories`);
    console.log(`Inserted ${services.length} services`);
    console.log(`Inserted ${orders.length} orders`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Execute the seeding
seedDatabase();