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

### Common Response Format
All API endpoints follow a standard response format:

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "errors": []
}
```

### Error Response Format
When an error occurs, the response will follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific error message"
    }
  ]
}
```

### Authentication Endpoints

#### User Registration
- **POST** `/api/auth/register`
- **Description**: Register a new user account
- **Auth Required**: No
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```
- **Success Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "message": "Registration successful"
}
```

#### User Login
- **POST** `/api/auth/login`
- **Description**: Authenticate user and receive JWT token
- **Auth Required**: No
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```
- **Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "userId": "user123",
      "email": "user@example.com",
      "role": "user"
    }
  },
  "message": "Login successful"
}
```

#### Get User Profile
- **GET** `/api/auth/me`
- **Description**: Retrieve current user's profile
- **Auth Required**: Yes (JWT Token)
- **Headers**: `Authorization: Bearer <token>`
- **Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "createdAt": "2023-01-01T00:00:00Z"
  },
  "message": "Profile retrieved successfully"
}
```

### Services Endpoints

#### List All Services
- **GET** `/api/services`
- **Description**: Retrieve all available services with pagination
- **Auth Required**: No
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `category` (optional): Filter by category ID
  - `search` (optional): Search term
  - `minPrice` (optional): Minimum price filter
  - `maxPrice` (optional): Maximum price filter
- **Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "id": "service123",
        "name": "Premium Service",
        "description": "Detailed service description",
        "price": 99.99,
        "duration": 60,
        "categoryId": "cat123"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "pages": 10
    }
  },
  "message": "Services retrieved successfully"
}
```

#### Create Service (Admin)
- **POST** `/api/services`
- **Description**: Create a new service
- **Auth Required**: Yes (Admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "name": "Premium Service",
  "description": "Detailed service description",
  "price": 99.99,
  "duration": 60,
  "categoryId": "cat123",
  "features": ["feature1", "feature2"]
}
```
- **Success Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "service123",
    "name": "Premium Service",
    "description": "Detailed service description",
    "price": 99.99,
    "duration": 60,
    "categoryId": "cat123",
    "features": ["feature1", "feature2"]
  },
  "message": "Service created successfully"
}
```

### Orders Endpoints

#### Create Order
- **POST** `/api/orders`
- **Description**: Create a new service order
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "serviceId": "service123",
  "appointmentDate": "2024-01-01T10:00:00Z",
  "notes": "Special requirements",
  "contactPreference": "email"
}
```
- **Success Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "orderId": "order123",
    "status": "pending",
    "service": {
      "id": "service123",
      "name": "Premium Service"
    },
    "appointmentDate": "2024-01-01T10:00:00Z",
    "totalAmount": 99.99
  },
  "message": "Order created successfully"
}
```

#### List Orders
- **GET** `/api/orders`
- **Description**: Retrieve user's orders with pagination
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `status` (optional): Filter by status
- **Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "orderId": "order123",
        "status": "pending",
        "service": {
          "id": "service123",
          "name": "Premium Service"
        },
        "appointmentDate": "2024-01-01T10:00:00Z",
        "totalAmount": 99.99
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "pages": 5
    }
  },
  "message": "Orders retrieved successfully"
}
```

### CRM Endpoints

#### Create CRM Record
- **POST** `/api/crm`
- **Description**: Create a new CRM record
- **Auth Required**: Yes (Staff/Admin)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "customerId": "user123",
  "type": "inquiry",
  "subject": "Service Information",
  "description": "Customer inquired about premium services",
  "priority": "medium"
}
```
- **Success Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "recordId": "crm123",
    "customer": {
      "id": "user123",
      "name": "John Doe"
    },
    "type": "inquiry",
    "subject": "Service Information",
    "status": "open",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "message": "CRM record created successfully"
}
```

### Checkout Endpoints

#### Initialize Checkout
- **POST** `/api/checkout/process`
- **Description**: Initialize payment processing for an order
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "orderId": "order123",
  "paymentMethod": "card",
  "currency": "USD"
}
```
- **Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "checkoutId": "chk123",
    "paymentUrl": "https://payment-gateway.com/pay/chk123",
    "amount": 99.99,
    "currency": "USD",
    "expiresAt": "2024-01-01T01:00:00Z"
  },
  "message": "Checkout initialized successfully"
}
```

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