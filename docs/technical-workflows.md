# Technical Workflows

## Application Architecture Overview

The Supplier & Vendor Management System is built using NestJS framework with a modular architecture. The main application is configured in `app.module.ts` which imports all feature modules and the database module. The application uses TypeORM for database operations, JWT for authentication, and class-validator for input validation. The main entry point is in `main.ts` where the application is configured with global prefix `/api`, CORS, validation pipes, and static assets for the frontend.

## Authentication & Authorization Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend (NestJS)
    participant AuthS as AuthService
    participant UserS as UsersService
    participant DB as MySQL Database
    participant JWT as JWT Library
    
    U->>F: Enter credentials
    F->>B: POST /api/auth/login
    B->>AuthS: signIn(username, password)
    AuthS->>UserS: validateUser(username, password)
    UserS->>DB: findOne user by username
    DB-->>UserS: User entity (with password_hash)
    UserS->>UserS: Compare password with bcrypt
    alt Valid credentials
        UserS-->>AuthS: Validated user object
        AuthS->>JWT: Sign JWT payload (id, username, roleId)
        JWT-->>AuthS: Signed JWT token
        AuthS-->>B: { access_token: "..." }
        B-->>F: 200 OK { access_token: "..." }
        F->>F: Store token in browser storage
        F-->>U: Redirect to dashboard
    else Invalid credentials
        UserS-->>AuthS: null/undefined
        AuthS-->>B: 401 Unauthorized
        B-->>F: 401 Unauthorized
        F-->>U: Show error message
    end
```

## JWT Token Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant AuthM as AuthMiddleware
    participant B as Backend Controllers
    participant JWT_LIB as JWT Library
    
    U->>F: Login with credentials
    F->>F: Store JWT from response
    F->>B: GET /api/suppliers (with Authorization: Bearer <token>)
    AuthM->>JWT_LIB: Verify token with secret
    JWT_LIB-->>AuthM: Decoded payload {sub, username, roleId}
    AuthM->>B: Request validated, continue
    B->>B: Process suppliers request
    B->>F: Suppliers JSON response
    F-->>U: Display suppliers
    
    Note over AuthM, B: AuthMiddleware processes all requests
    Note over F, B: JWT_SECRET from environment variables
```

## API Request/Response Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend (NestJS)
    participant Ctrl as Controller
    participant Svc as Service
    participant Repo as TypeORM Repository
    participant DB as MySQL
    
    U->>F: Click "View Suppliers"
    F->>B: GET /api/suppliers (with JWT)
    B->>Ctrl: Route handler for GET /suppliers
    Ctrl->>Svc: findAll() method
    Svc->>Repo: find() with relations
    Repo->>DB: SELECT * FROM suppliers
    DB-->>Repo: Suppliers data
    Repo-->>Svc: Supplier entities array
    Svc->>Svc: Process any business logic
    Svc-->>Ctrl: Supplier data
    Ctrl->>Ctrl: Format response
    Ctrl-->>B: JSON response
    B-->>F: JSON response
    F->>F: Process and display data
    F-->>U: Render suppliers list
    
    U->>F: Click "Add Supplier"
    F->>F: Show form
    U->>F: Fill form and submit
    F->>B: POST /api/suppliers (with JWT and CreateSupplierDto)
    B->>Ctrl: Route handler for POST /suppliers
    B->>B: Validation pipe processes CreateSupplierDto
    Ctrl->>Svc: create(createSupplierDto)
    Svc->>Svc: Create supplier entity from DTO
    Svc->>Repo: save() supplier
    Repo->>DB: INSERT INTO suppliers
    DB-->>Repo: Success with new supplier ID
    Repo-->>Svc: Saved supplier entity
    Svc-->>Ctrl: Saved supplier entity
    Ctrl-->>B: 201 Created with supplier data
    B-->>F: 201 Created response
    F-->>U: Show success message
```

## Purchase Order Creation Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant Ctrl as PurchaseOrdersController
    participant Svc as PurchaseOrdersService
    participant PORepo as PurchaseOrder Repository
    participant ItemRepo as PurchaseOrderItem Repository
    participant DB as MySQL
    
    U->>F: Initiate PO creation
    F->>B: POST /api/purchase-orders (with JWT and CreatePurchaseOrderDto)
    B->>Ctrl: create() method with validated DTO
    Ctrl->>Svc: create(createPurchaseOrderDto)
    Svc->>Svc: Create purchase order entity
    Svc->>PORepo: save() purchase order
    PORepo->>DB: INSERT INTO purchase_orders
    DB-->>PORepo: PO ID
    PORepo-->>Svc: Saved purchase order with ID
    
    loop For each item in DTO
        Svc->>ItemRepo: Create purchase order item entities
        ItemRepo->>DB: INSERT INTO purchase_order_items
        DB-->>ItemRepo: Item ID
        ItemRepo-->>Svc: Saved item
    end
    
    Svc-->>Ctrl: Created PO with items
    Ctrl-->>B: 201 Created response
    B-->>F: Created PO with items
    F-->>U: Show success message
```

## Invoice & Payment Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant InvCtrl as InvoicesController
    participant PayCtrl as PaymentsController
    participant InvSvc as InvoicesService
    participant PaySvc as PaymentsService
    participant InvRepo as Invoice Repository
    participant PayRepo as Payment Repository
    participant DB as MySQL
    
    U->>F: Create invoice for PO
    F->>B: POST /api/invoices (with JWT and CreateInvoiceDto)
    B->>InvCtrl: create() method
    InvCtrl->>InvSvc: create(createInvoiceDto)
    InvSvc->>InvRepo: Create and save invoice
    InvRepo->>DB: INSERT INTO invoices
    DB-->>InvRepo: Invoice ID
    InvRepo-->>InvSvc: Saved invoice
    InvSvc-->>InvCtrl: Created invoice
    InvCtrl-->>B: 201 Created response
    B-->>F: Invoice created
    F-->>U: Show invoice details
    
    U->>F: Record payment
    F->>B: POST /api/payments (with JWT and CreatePaymentDto)
    B->>PayCtrl: create() method
    PayCtrl->>PaySvc: create(createPaymentDto)
    PaySvc->>PayRepo: Create and save payment
    PayRepo->>DB: INSERT INTO payments
    DB-->>PayRepo: Payment ID
    PayRepo-->>PaySvc: Saved payment
    PaySvc-->>PayCtrl: Payment confirmation
    PayCtrl-->>B: 201 Created response
    B-->>F: Payment confirmation
    F-->>U: Show payment success
```

## Database Module Configuration Workflow

```mermaid
sequenceDiagram
    participant App as AppModule
    participant DBMod as DatabaseModule
    participant TypeOrm as TypeORM
    participant Config as ConfigService
    participant Env as Environment Variables
    
    App->>DBMod: Import DatabaseModule
    DBMod->>Config: Get database config
    Config->>Env: Read DB_HOST, DB_PORT, DB_USERNAME, etc
    Env-->>Config: Configuration values
    Config-->>DBMod: Database configuration object
    DBMod->>TypeOrm: Configure connection with TypeOrmModule.forRootAsync
    TypeOrm->>TypeOrm: Set up connection pool
    TypeOrm-->>DBMod: Connection established
    DBMod-->>App: DatabaseModule ready
    App->>App: Continue with other modules
```

## Database Seeding Workflow

```mermaid
sequenceDiagram
    participant D as Developer
    participant S as ComprehensiveSeed (comprehensive-seed.ts)
    participant App as AppModule
    participant NF as NestFactory
    participant Repos as Repositories
    participant DB as MySQL
    
    D->>S: Run npm run seed:comprehensive
    S->>NF: Create application context with AppModule
    NF->>App: Initialize modules
    App-->>S: Application context ready
    S->>S: Get repository tokens for all entities
    S->>Repos: Get repository instances
    Repos-->>S: Repository instances
    S->>S: Create seed data for all entities
    
    loop For each entity type
        S->>DB: Insert roles
        DB-->>S: Roles inserted
        S->>DB: Insert users (with hashed passwords)
        DB-->>S: Users inserted
        S->>DB: Insert suppliers
        DB-->>S: Suppliers inserted
        S->>DB: Insert products
        DB-->>S: Products inserted
        S->>DB: Insert categories
        DB-->>S: Categories inserted
        S->>DB: Insert supplier_products
        DB-->>S: Supplier-products inserted
        S->>DB: Insert product_categories
        DB-->>S: Product-categories inserted
        S->>DB: Insert purchase_orders
        DB-->>S: POs inserted
        S->>DB: Insert purchase_order_items
        DB-->>S: PO items inserted
        S->>DB: Insert invoices
        DB-->>S: Invoices inserted
        S->>DB: Insert payments
        DB-->>S: Payments inserted
    end
    S-->>D: Seeding completed successfully
```

## Data Model Relationships

```mermaid
erDiagram
    USERS ||--o{ ROLES : "has"
    USERS ||--o{ PURCHASE_ORDERS : "creates"
    SUPPLIERS ||--o{ PURCHASE_ORDERS : "receives"
    SUPPLIERS ||--o{ SUPPLIER_PRODUCTS : "supplies"
    PRODUCTS ||--o{ SUPPLIER_PRODUCTS : "supplied_by"
    PRODUCTS ||--o{ PRODUCT_CATEGORIES : "belongs_to"
    CATEGORIES ||--o{ PRODUCT_CATEGORIES : "contains"
    PURCHASE_ORDERS ||--o{ PURCHASE_ORDER_ITEMS : "contains"
    PRODUCTS ||--o{ PURCHASE_ORDER_ITEMS : "ordered_in"
    PURCHASE_ORDERS ||--o{ INVOICES : "generates"
    INVOICES ||--o{ PAYMENTS : "receives"
    
    USERS {
        int id PK
        string username
        string email
        string password_hash
        int role_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    ROLES {
        int id PK
        string role_name
    }
    
    SUPPLIERS {
        int id PK
        string name
        string contact_person
        string email
        string phone
        text address
        tinyint rating
        timestamp created_at
        timestamp updated_at
    }
    
    PRODUCTS {
        int id PK
        string name
        text description
        decimal price
    }
    
    CATEGORIES {
        int id PK
        string name
    }
    
    PRODUCT_CATEGORIES {
        int product_id PK, FK
        int category_id PK, FK
    }
    
    SUPPLIER_PRODUCTS {
        int supplier_id PK, FK
        int product_id PK, FK
        decimal price
    }
    
    PURCHASE_ORDERS {
        int id PK
        int supplier_id FK
        int created_by_id FK
        date order_date
        string status
        timestamp created_at
    }
    
    PURCHASE_ORDER_ITEMS {
        int id PK
        int purchase_order_id FK
        int product_id FK
        int quantity
        decimal unit_price
    }
    
    INVOICES {
        int id PK
        int purchase_order_id FK
        date invoice_date
        date due_date
        string status
    }
    
    PAYMENTS {
        int id PK
        int invoice_id FK
        date payment_date
        decimal amount
    }
```

## Frontend Integration Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant HTML as index.html
    participant JS as app.js
    participant API as Backend API
    
    U->>HTML: Load website
    HTML->>JS: Initialize JavaScript
    JS->>JS: Set up event listeners
    U->>JS: Interact with UI
    JS->>API: Make API calls (with JWT if needed)
    API-->>JS: Return JSON data
    JS->>JS: Update DOM with data
    JS-->>U: Display updated UI
```

## Testing Workflow

```mermaid
flowchart TD
    A[Developer] --> B[Write Test Cases in Jest]
    B --> C[Run Tests with npm test]
    C --> D{Tests Pass?}
    D -- Yes --> E[Commit Code]
    D -- No --> F[Debug & Fix Issues]
    F --> C
    E --> G[CI/CD Pipeline Run Tests]
    G --> H{Automated Tests Pass?}
    H -- Yes --> I[Deploy to Production]
    H -- No --> J[Notify Developer]
    J --> F
    
    subgraph "Test Structure"
        K[auth.service.spec.ts]
        L[suppliers.service.spec.ts]
        M[users.service.spec.ts]
    end
    B --> K
    B --> L
    B --> M
```