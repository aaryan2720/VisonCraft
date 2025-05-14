# VisionCraft Backend Documentation

## Project Overview
VisionCraft is a service management system with features for handling services, customer relationships, orders, and authentication. The backend is built using Node.js with Express.js framework and MongoDB as the database.

## API Documentation

### Authentication APIs

#### Register User
- **Endpoint**: `POST /api/auth/register`
- **Description**: Register a new user in the system
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }
  ```
- **Response**: Returns user data and authentication token

#### User Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticate existing user
- **Access**: Public
- **Rate Limit**: 5 attempts per 15 minutes
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: Returns authentication token and user data

#### Get User Profile
- **Endpoint**: `GET /api/auth/me`
- **Description**: Retrieve current user's profile
- **Access**: Protected (requires authentication)
- **Response**: Returns detailed user profile information

#### User Logout
- **Endpoint**: `POST /api/auth/logout`
- **Description**: Logout current user
- **Access**: Protected (requires authentication)

#### Admin Login
- **Endpoint**: `POST /api/auth/admin/login`
- **Description**: Authenticate admin users
- **Access**: Admin only
- **Rate Limit**: 5 attempts per 15 minutes

#### Admin Logout
- **Endpoint**: `POST /api/auth/admin/logout`
- **Description**: Logout admin user
- **Access**: Admin only

## File Structure and Purpose

### Core Files
- `src/index.js`: Main application entry point
- `.env`: Environment configuration file
- `.env.example`: Example environment variables template
- `package.json`: Project dependencies and scripts

### Source Code Organization

#### Authentication System (`src/routes/auth.js`)
- Handles user authentication and authorization
- Implements JWT-based authentication
- Manages user sessions and token blacklisting
- Includes rate limiting for security

#### Middleware (`src/middleware/`)
- `adminAuth.js`: Admin-specific authentication middleware
- `validation.js`: Request validation middleware
- Rate limiting and security middleware

#### Models (`src/models/`)
- `User.js`: User data model and schema
- Includes password hashing and validation methods

#### Utilities (`src/utils/`)
- `logger.js`: Application logging utility
- `rateLimiter.js`: Rate limiting configuration
- `tokenBlacklist.js`: JWT token blacklisting management

## Implementation Changes

### Security Enhancements
1. Implemented Redis-based token blacklisting
2. Added rate limiting for authentication endpoints
3. Enhanced admin authentication middleware
4. Implemented secure password hashing

### Route Modifications
1. Added admin-specific routes with proper authorization
2. Enhanced user profile endpoint with additional fields
3. Implemented proper error handling and validation
4. Added rate limiting to sensitive endpoints

### Redis Integration
1. Implemented Redis for token blacklisting
2. Added Redis-based rate limiting
3. Enhanced connection retry strategy
4. Implemented proper error handling for Redis operations

## Development Requirements

### Environment Setup
1. Node.js (v14 or higher)
2. Redis server
3. MongoDB database

### Required Environment Variables
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/visioncraft
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

### Installation Steps
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start Redis server
5. Start the application: `npm start`

### Testing
- Run tests: `npm test`
- Test coverage: `npm run test:coverage`

## API Security Considerations
1. All sensitive routes are protected with JWT authentication
2. Rate limiting is implemented for security-critical endpoints
3. Token blacklisting prevents unauthorized token reuse
4. Admin routes have additional security layers
5. Password hashing is implemented for user security

## Error Handling
- Consistent error response format
- Proper validation error messages
- Rate limit error responses
- Authentication failure handling

## Monitoring and Logging
- Application logs stored in `/logs` directory
- Error tracking and monitoring
- Rate limit monitoring
- Redis connection status logging
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