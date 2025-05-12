const mongoose = require('mongoose');

const mockUsers = [
  {
    name: 'Admin User',
    email: 'admin@visioncraft.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1234567890',
    address: '123 Admin Street, Tech City',
    createdAt: new Date('2023-01-01')
  },
  {
    name: 'Regular User',
    email: 'user@visioncraft.com',
    password: 'user123',
    role: 'user',
    phone: '+1987654321',
    address: '456 User Avenue, Tech City',
    createdAt: new Date('2023-01-02')
  },
  {
    name: 'Business Client',
    email: 'business@visioncraft.com',
    password: 'business123',
    role: 'business',
    phone: '+1122334455',
    address: '789 Business Blvd, Tech City',
    createdAt: new Date('2023-01-03')
  }
];

const mockCategories = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Photography',
    description: 'Professional photography services',
    status: 'active'
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Videography',
    description: 'Professional video production services',
    status: 'active'
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Design',
    description: 'Graphic and digital design services',
    status: 'active'
  }
];

const mockServices = [
  {
    name: 'Wedding Photography',
    description: 'Complete wedding photography package',
    category: mockCategories[0]._id,
    price: 1999.99,
    duration: 480,
    status: 'active',
    features: ['Full day coverage', 'Edited photos', 'Online gallery'],
    availability: true
  },
  {
    name: 'Corporate Video',
    description: 'Professional corporate video production',
    category: mockCategories[1]._id,
    price: 2999.99,
    duration: 720,
    status: 'active',
    features: ['4K recording', 'Professional editing', 'Multiple revisions'],
    availability: true
  },
  {
    name: 'Logo Design',
    description: 'Custom logo design service',
    category: mockCategories[2]._id,
    price: 499.99,
    duration: 120,
    status: 'active',
    features: ['Multiple concepts', 'Vector files', 'Unlimited revisions'],
    availability: true
  }
];

const mockOrders = [
  {
    services: [
      {
        serviceId: mockServices[0]._id,
        quantity: 1,
        price: mockServices[0].price
      }
    ],
    totalAmount: mockServices[0].price,
    status: 'pending',
    paymentStatus: 'awaiting',
    scheduledDate: new Date('2024-03-15')
  },
  {
    services: [
      {
        serviceId: mockServices[1]._id,
        quantity: 1,
        price: mockServices[1].price
      }
    ],
    totalAmount: mockServices[1].price,
    status: 'confirmed',
    paymentStatus: 'paid',
    scheduledDate: new Date('2024-03-20')
  },
  {
    services: [
      {
        serviceId: mockServices[2]._id,
        quantity: 2,
        price: mockServices[2].price
      }
    ],
    totalAmount: mockServices[2].price * 2,
    status: 'completed',
    paymentStatus: 'paid',
    scheduledDate: new Date('2024-02-28')
  }
];

module.exports = {
  mockUsers,
  mockCategories,
  mockServices,
  mockOrders
};