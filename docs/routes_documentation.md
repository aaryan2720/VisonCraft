# VisionCraft API Routes Documentation

## Authentication Routes

### User Authentication

#### POST /api/auth/register
- **Access**: Public
- **Description**: Register a new user
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
- **Response**: User data and authentication token

#### POST /api/auth/login
- **Access**: Public
- **Rate Limit**: 5 attempts/15 minutes
- **Description**: Authenticate existing user
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: Authentication token and user data

#### GET /api/auth/me
- **Access**: Protected (requires authentication)
- **Description**: Get current user's profile
- **Response**: User profile information

#### POST /api/auth/logout
- **Access**: Protected (requires authentication)
- **Description**: Logout current user

### Admin Authentication

#### POST /api/auth/admin/login
- **Access**: Admin only
- **Rate Limit**: 5 attempts/15 minutes
- **Description**: Authenticate admin users

#### POST /api/auth/admin/logout
- **Access**: Admin only
- **Description**: Logout admin user

## Quick Reference

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- POST `/api/auth/admin/login` - Admin login
- GET `/api/auth/me` - Get user profile
- POST `/api/auth/logout` - User logout
- POST `/api/auth/admin/logout` - Admin logout

### Services
- POST `/api/services/categories` - Create category
- GET `/api/services/categories` - List categories
- DELETE `/api/services/categories/:id` - Delete category
- POST `/api/services` - Create service
- GET `/api/services` - List services
- GET `/api/services/:id` - Get service details
- PATCH `/api/services/:id` - Update service
- DELETE `/api/services/:id` - Delete service
- PATCH `/api/services/bulk/status` - Bulk update status
- DELETE `/api/services/bulk` - Bulk delete services

### Orders
- POST `/api/orders` - Create order
- GET `/api/orders` - List orders
- GET `/api/orders/:id` - Get order details
- PATCH `/api/orders/:id/status` - Update order status

### CRM
- POST `/api/crm` - Create CRM record
- GET `/api/crm` - List CRM records
- GET `/api/crm/:id` - Get CRM record details
- PATCH `/api/crm/:id/status` - Update CRM status
- POST `/api/crm/:id/notes` - Add CRM notes
- POST `/api/crm/:id/resolve` - Resolve CRM case

### Documents
- POST `/api/documents/upload` - Upload document
- GET `/api/documents/:key` - Get document

### Checkout
- POST `/api/checkout/process` - Process checkout
- POST `/api/checkout/confirm/:orderId` - Confirm checkout

### Webhooks
- POST `/api/webhook/stripe` - Stripe webhook handler

## Detailed Documentation

## Authentication Routes

### User Registration
- **POST** `/api/auth/register`
- **Description**: Register a new user account
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string",
    "firstName": "string",
    "lastName": "string",
    "phone": "string"
  }
  ```
- **Response**: Returns user data and authentication token

### User Login
- **POST** `/api/auth/login`
- **Description**: Authenticate user and get token
- **Rate Limited**: Yes
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: Returns user data and authentication token

### Admin Login
- **POST** `/api/auth/admin/login`
- **Description**: Authenticate admin user
- **Rate Limited**: Yes
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: Returns admin user data and authentication token

### Get User Profile
- **GET** `/api/auth/me`
- **Description**: Get current user's profile
- **Authentication**: Required (Bearer Token)
- **Response**: Returns detailed user profile

### Logout
- **POST** `/api/auth/logout`
- **Description**: Logout current user
- **Authentication**: Required (Bearer Token)
- **Response**: Success message

## Service Management Routes

### Categories

#### Create Category
- **POST** `/api/services/categories`
- **Description**: Create a new service category
- **Authentication**: Required (Admin only)
- **Body**:
  ```json
  {
    "name": "string"
  }
  ```

#### List Categories
- **GET** `/api/services/categories`
- **Description**: Get all active service categories
- **Authentication**: Not required

### Services

#### Create Service
- **POST** `/api/services`
- **Description**: Create a new service
- **Authentication**: Required (Admin only)
- **Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "category": "string",
    "price": "number",
    "duration": "number"
  }
  ```

#### List Services
- **GET** `/api/services`
- **Description**: Get services with filtering options
- **Query Parameters**:
  - `active`: boolean
  - `category`: string
  - `search`: string
  - `minPrice`: number
  - `maxPrice`: number
  - `minDuration`: number
  - `maxDuration`: number
  - `page`: number
  - `limit`: number

#### Bulk Update Service Status
- **PATCH** `/api/services/bulk/status`
- **Description**: Update active status for multiple services
- **Authentication**: Required (Admin only)
- **Body**:
  ```json
  {
    "serviceIds": ["string"],
    "active": "boolean"
  }
  ```

#### Bulk Delete Services
- **DELETE** `/api/services/bulk`
- **Description**: Delete multiple services
- **Authentication**: Required (Admin only)
- **Body**:
  ```json
  {
    "serviceIds": ["string"]
  }
  ```

## Order Management Routes

### Create Order
- **POST** `/api/orders`
- **Description**: Create a new order
- **Authentication**: Required
- **Body**:
  ```json
  {
    "services": [{
      "service": "string (service ID)",
      "quantity": "number"
    }],
    "scheduledDate": "string (ISO date)",
    "notes": "string"
  }
  ```

### List Orders
- **GET** `/api/orders`
- **Description**: Get all orders with filtering options
- **Authentication**: Required
- **Query Parameters**:
  - `status`: string
  - `startDate`: string (ISO date)
  - `endDate`: string (ISO date)

### Get Order Details
- **GET** `/api/orders/:id`
- **Description**: Get detailed information about a specific order
- **Authentication**: Required

### Update Order Status
- **PATCH** `/api/orders/:id/status`
- **Description**: Update the status of an order
- **Authentication**: Required (Staff/Admin only)
- **Body**:
  ```json
  {
    "status": "string"
  }
  ```

## CRM Routes

### Create CRM Record
- **POST** `/api/crm`
- **Description**: Create a new CRM record
- **Authentication**: Required
- **Body**:
  ```json
  {
    "type": "string",
    "subject": "string",
    "description": "string",
    "priority": "string",
    "relatedService": "string (service ID)"
  }
  ```

### List CRM Records
- **GET** `/api/crm`
- **Description**: Get all CRM records with filtering options
- **Authentication**: Required
- **Query Parameters**:
  - `status`: string
  - `type`: string
  - `priority`: string
  - `stage`: string
  - `assignedTo`: string
  - `relatedService`: string
  - `startDate`: string (ISO date)
  - `endDate`: string (ISO date)
  - `search`: string
  - `sortBy`: string
  - `page`: number
  - `limit`: number

### Get CRM Record Details
- **GET** `/api/crm/:id`
- **Description**: Get detailed information about a specific CRM record
- **Authentication**: Required

### Update CRM Status
- **PATCH** `/api/crm/:id/status`
- **Description**: Update the status of a CRM record
- **Authentication**: Required (Staff/Admin only)
- **Body**:
  ```json
  {
    "status": "string"
  }
  ```

### Add CRM Notes
- **POST** `/api/crm/:id/notes`
- **Description**: Add notes to a CRM record
- **Authentication**: Required
- **Body**:
  ```json
  {
    "content": "string"
  }
  ```

### Resolve CRM Case
- **POST** `/api/crm/:id/resolve`
- **Description**: Mark a CRM case as resolved
- **Authentication**: Required (Staff/Admin only)
- **Body**:
  ```json
  {
    "resolution": "string",
    "resolutionDetails": "string"
  }
  ```

## Document Management Routes

### Upload Document
- **POST** `/api/documents/upload`
- **Description**: Upload a new document
- **Authentication**: Required
- **Body**: multipart/form-data
  - `document`: file

### Get Document
- **GET** `/api/documents/:key`
- **Description**: Retrieve a specific document
- **Authentication**: Required

## Checkout Routes

### Process Checkout
- **POST** `/api/checkout/process`
- **Description**: Process a new checkout
- **Authentication**: Required
- **Rate Limited**: Yes
- **Body**:
  ```json
  {
    "orderId": "string",
    "paymentMethod": "string"
  }
  ```

### Confirm Checkout
- **POST** `/api/checkout/confirm/:orderId`
- **Description**: Confirm a processed checkout
- **Authentication**: Required
- **Body**:
  ```json
  {
    "paymentIntentId": "string"
  }
  ```

## Webhook Routes

### Stripe Webhook
- **POST** `/api/webhook/stripe`
- **Description**: Handle Stripe webhook events
- **Authentication**: None (Stripe signature verification)
- **Body**: Stripe event payload