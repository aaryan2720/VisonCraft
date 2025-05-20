# VisionCraft Database Schema Documentation

This document outlines the database schema and relationships between different entities in the VisionCraft system.

## Entity Relationship Diagram

```mermaid
graph TD
    User[User] --> |creates| Order[Order]
    User --> |has| CRM[CRM Record]
    Service[Service] --> |belongs to| Category[Category]
    Order --> |includes| Service
    Order --> |has| Invoice[Invoice]
    CRM --> |relates to| Service
    User --> |has role| Role[Role/Permission]

    %% Entity Details
    User["User\n- _id\n- email\n- password (hashed)\n- role\n- name"]
    Service["Service\n- _id\n- name\n- description\n- price\n- categoryId"]
    Category["Category\n- _id\n- name\n- description"]
    Order["Order\n- _id\n- userId\n- services[]\n- totalAmount\n- status"]
    CRM["CRM Record\n- _id\n- type\n- subject\n- description\n- priority\n- relatedService"]
    Invoice["Invoice\n- _id\n- orderId\n- amount\n- status"]
    Role["Role\n- _id\n- name\n- permissions[]"]
```

## Schema Relationships

### User
- Has many Orders (one-to-many)
- Has many CRM Records (one-to-many)
- Has one Role (one-to-one)

### Service
- Belongs to one Category (many-to-one)
- Included in many Orders (many-to-many)
- Referenced in many CRM Records (one-to-many)

### Order
- Belongs to one User (many-to-one)
- Has many Services (many-to-many)
- Has one Invoice (one-to-one)

### CRM Record
- Belongs to one User (many-to-one)
- Can reference one Service (many-to-one)

### Category
- Has many Services (one-to-many)

## Key Features

1. **User Management**
   - Secure password hashing
   - Role-based access control
   - Authentication using JWT

2. **Service Organization**
   - Hierarchical category structure
   - Detailed service information
   - Price management

3. **Order Processing**
   - Multiple services per order
   - Automatic invoice generation
   - Order status tracking

4. **Customer Relationship Management**
   - Issue tracking
   - Service-related inquiries
   - Priority-based handling

This schema design supports the core functionalities of VisionCraft while maintaining data integrity and efficient relationships between different entities.