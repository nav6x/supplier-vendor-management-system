# System Overview

## Complete System Architecture

```mermaid
graph TD
    subgraph "CLIENT_SIDE"
        A["Web Browser<br/>(Vanilla JS Frontend)"]
        B["HTML/CSS/Bootstrap UI"]
        C["REST API Calls"]
    end
    
    subgraph "SERVER_SIDE"
        D["NestJS Application"]
        E["Controller Layer<br/>(HTTP Endpoints)"]
        F["Service Layer<br/>(Business Logic)"]
        G["Data Access Layer<br/>(TypeORM)"]
        H["Authentication<br/>(JWT)"]
        I["Middleware<br/>(Auth, Logging)"]
    end
    
    subgraph "DATABASE"
        J["MySQL Database"]
        K["Tables: users, roles,<br/>suppliers, products,<br/>categories, etc."]
    end
    
    subgraph "EXTERNAL_SERVICES"
        L["JWT Library"]
        M["Bcrypt for Password Hashing"]
    end
    
    subgraph "DEVELOPMENT_TOOLS"
        N["Jest for Testing"]
        O["TypeScript Compiler"]
        P["NestJS CLI"]
    end
    
    A --> B
    A --> C
    C --> D
    D --> E
    D --> H
    D --> I
    E --> F
    H --> L
    F --> G
    G --> J
    J --> K
    F --> M
    D --> N
    D --> O
    D --> P
    
    style A fill:#e3f2fd
    style B fill:#bbdefb
    style C fill:#c8e6c9
    style D fill:#f3e5f5
    style E fill:#e1f5fe
    style F fill:#e8f5e8
    style G fill:#fff3e0
    style H fill:#fce4ec
    style I fill:#f3e5f5
    style J fill:#ffe0b2
    style K fill:#ffccbc
    style L fill:#e0f2f1
    style M fill:#f8bbd0
    style N fill:#c5e1a5
    style O fill:#80deea
    style P fill:#ffab91
```

## System Components Breakdown

```mermaid
mindmap
  root((Supplier & Vendor<br/>Management System))
    Frontend
      Vanilla JavaScript
      HTML/CSS
      Bootstrap UI
      REST API Client
      Local Storage
    Backend
      NestJS Framework
      Controllers
      Services
      Repositories
      Middleware
      Authentication
      Validation
      Seeding Scripts
    Database
      MySQL
      Users Table
      Roles Table
      Suppliers Table
      Products Table
      Categories Table
      Supplier_Products Table
      Product_Categories Table
      Purchase Orders Table
      Purchase Order Items Table
      Invoices Table
      Payments Table
      Relationships
    Security
      JWT Tokens
      Password Hashing
      Role-Based Access
      Input Validation
    Features
      User Management
      Supplier Management
      Product Management
      Category Management
      Purchase Orders
      Invoicing
      Payments
      Database Seeding
    Integrations
      RESTful API
      JSON Communication
      HTTP Methods
      Status Codes
    Development
      Jest Testing
      TypeScript
      TypeORM
      ESLint
      Prettier
```

## Technology Stack

```mermaid
graph LR
    A[Frontend] --> B[Backend]
    B --> C[Database]
    
    subgraph "FRONTEND_TECH"
        A --> A1[HTML5]
        A --> A2[CSS3]
        A --> A3[JavaScript ES6+]
        A --> A4[Bootstrap 5]
        A --> A5[Fetch API]
    end
    
    subgraph "BACKEND_TECH"
        B --> B1[NestJS]
        B --> B2[TypeScript]
        B --> B3[Node.js]
        B --> B4[Express.js]
        B --> B5[TypeORM]
        B --> B6[JWT]
        B --> B7[Bcrypt.js]
        B --> B8[Class Validator]
        B --> B9[Class Transformer]
    end
    
    subgraph "DATABASE_TECH"
        C --> C1[MySQL 8.0+]
        C --> C2[SQL]
        C --> C3[ACID Properties]
    end
    
    subgraph "DEVELOPMENT_TOOLS"
        B --> D1[Jest]
        B --> D2[ESLint]
        B --> D3[Prettier]
        B --> D4[NestJS CLI]
    end
    
    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#fff3e0
    style A1 fill:#bbdefb
    style A2 fill:#c8e6c9
    style A3 fill:#e1f5fe
    style A4 fill:#e8f5e8
    style A5 fill:#fff8e1
    style B1 fill:#f3e5f5
    style B2 fill:#fce4ec
    style B3 fill:#e0f2f1
    style B4 fill:#ffccbc
    style B5 fill:#d1c4e9
    style B6 fill:#b2ebf2
    style B7 fill:#b3e5fc
    style B8 fill:#80deea
    style B9 fill:#4fc3f7
    style C1 fill:#ffe0b2
    style C2 fill:#ffecb3
    style C3 fill:#ffd54f
    style D1 fill:#c5e1a5
    style D2 fill:#a5d6a7
    style D3 fill:#81c784
    style D4 fill:#66bb6a
```

## Module Architecture

The system is organized into the following modules:

1. **Auth Module** - Handles authentication and JWT token generation
2. **Users Module** - Manages user accounts and roles
3. **Suppliers Module** - Manages supplier information
4. **Products Module** - Manages products and categories
5. **Purchase Orders Module** - Handles purchase order creation and management
6. **Invoices Module** - Manages invoice generation and tracking
7. **Payments Module** - Tracks payment records

Each module follows the NestJS modular architecture pattern with:
- Controllers (HTTP endpoints)
- Services (business logic)
- Entities (data models)
- DTOs (data transfer objects)
- Repositories (data access)

## Development & Testing

The system includes a comprehensive testing suite using Jest:
- Unit tests for services
- Mock repositories for isolated testing
- Test configuration files

Development tools include:
- ESLint for code quality
- Prettier for code formatting
- NestJS CLI for scaffolding
- TypeScript for type safety

## Seeding Scripts

The system provides multiple database seeding scripts:
- Basic seed for minimal data
- Full seed for comprehensive data
- Comprehensive seed for complete sample dataset

These scripts are useful for:
- Setting up development environments
- Testing functionality
- Demonstrating system capabilities

## API Structure

All API endpoints are prefixed with `/api/` and organized by module:
- `/api/auth` - Authentication endpoints
- `/api/users` - User management endpoints
- `/api/suppliers` - Supplier management endpoints
- `/api/products` - Product and category management endpoints
- `/api/purchase-orders` - Purchase order endpoints
- `/api/invoices` - Invoice endpoints
- `/api/payments` - Payment endpoints

## Security Features

- JWT-based authentication for all protected endpoints
- Bcrypt password hashing for secure storage
- Role-based access control
- Input validation using class-validator
- SQL injection prevention through TypeORM