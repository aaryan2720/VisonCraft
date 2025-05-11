# VisionCraft Backend Documentation

## Project Overview
VisionCraft is a service management system with features for handling services, customer relationships, orders, and authentication. The backend is built using Node.js with Express.js framework and MongoDB as the database.

## Project Structure

### Root Directory
- `.env` - Environment variables configuration
- `.env.example` - Example environment variables template
- `package.json` - Project dependencies and scripts
- `daily_tasks.txt` - Daily development tasks and notes

### Source Code (`/src`)

#### Models
Database schemas and models:
- `User.js` - User authentication and profile management
- `Service.js` - Service categories and individual services
- `Order.js` - Customer orders and appointments
- `CRM.js` - Customer relationship management records

#### Routes

##### Authentication (`auth.js`)
- User registration
- User login with rate limiting
- Profile retrieval
- JWT-based route protection middleware

##### Services (`services.js`)
Service and category management:
- Category CRUD operations
- Service CRUD operations
- Bulk operations for services
- Advanced filtering and search capabilities
- Pagination support

##### Orders (`orders.js`)
Order management system:
- Order creation
- Order status updates
- Filtering and retrieval
- Staff assignment

##### CRM (`crm.js`)
Customer relationship management:
- Record creation and tracking
- Status updates
- Note management
- Advanced filtering and search
- Stage tracking

##### Checkout (`checkout.js`)
Payment processing:
- Checkout initialization
- Payment confirmation
- Order creation integration

#### Middleware
- Rate limiting for authentication and checkout
- Request validation
- Error handling

#### Utils
- Checkout service implementation
- Helper functions

## Implemented Features

### Authentication
- Secure user registration with password hashing
- JWT-based authentication
- Role-based access control (user, staff, admin)
- Rate limiting for login attempts

### Services Management
- Category organization
- Service CRUD operations
- Bulk service status updates
- Advanced filtering (price, duration, category)
- Search functionality
- Pagination

### Order Management
- Order creation with service selection
- Status tracking
- Staff assignment
- Date scheduling
- Customer access control

### CRM System
- Customer interaction tracking
- Status and stage management
- Note taking functionality
- Service relation
- Staff assignment

### Checkout Process
- Secure payment processing
- Order integration
- CRM record creation

## Remaining Tasks

### High Priority
1. Implement email notifications for:
   - Order status changes
   - Appointment reminders
   - Registration confirmation

2. Add data validation and sanitization:
   - Input validation middleware
   - Request body sanitization
   - File upload validation

3. Enhance security measures:
   - Password reset functionality
   - Account verification
   - Session management

### Medium Priority
1. Implement additional features:
   - Staff scheduling system
   - Inventory management
   - Customer feedback system

2. Add reporting functionality:
   - Sales reports
   - Service popularity metrics
   - Customer engagement analytics

3. Enhance search capabilities:
   - Full-text search
   - Advanced filtering options
   - Sort by multiple criteria

### Low Priority
1. System optimizations:
   - Caching implementation
   - Query optimization
   - Response compression

2. Additional integrations:
   - Third-party calendar systems
   - SMS notifications
   - Social media integration

## API Documentation

### Authentication Endpoints
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user profile

### Services Endpoints
- GET `/api/services` - List all services
- POST `/api/services` - Create new service (admin)
- GET `/api/services/:id` - Get service details
- PATCH `/api/services/:id` - Update service (admin)
- DELETE `/api/services/:id` - Delete service (admin)
- POST `/api/services/categories` - Create category (admin)
- GET `/api/services/categories` - List categories

### Orders Endpoints
- POST `/api/orders` - Create new order
- GET `/api/orders` - List orders
- GET `/api/orders/:id` - Get order details
- PATCH `/api/orders/:id/status` - Update order status

### CRM Endpoints
- POST `/api/crm` - Create CRM record
- GET `/api/crm` - List CRM records
- GET `/api/crm/:id` - Get CRM record details
- PATCH `/api/crm/:id/status` - Update CRM status

### Checkout Endpoints
- POST `/api/checkout/process` - Initialize checkout
- POST `/api/checkout/confirm/:orderId` - Confirm payment

## Security Measures
- JWT authentication
- Rate limiting
- Role-based access control
- Input validation
- Error handling

## Development Guidelines
1. Follow RESTful API conventions
2. Implement proper error handling
3. Use async/await for asynchronous operations
4. Maintain consistent response format
5. Document all new endpoints
6. Write unit tests for new features

## Testing
Implement comprehensive testing:
- Unit tests for models
- Integration tests for API endpoints
- Authentication flow testing
- Error handling verification

## Deployment
Prepare for production deployment:
- Environment configuration
- Database optimization
- Security hardening
- Performance monitoring
- Backup strategy