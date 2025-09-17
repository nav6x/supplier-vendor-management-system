# Technical Workflows

## Authentication & Authorization Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (Vanilla JS)
    participant B as Backend (NestJS)
    participant DB as MySQL Database
    participant JWT as JWT Library
    
    U->>F: Enter credentials
    F->>B: POST /api/auth/login
    B->>DB: Query user by username
    DB-->>B: Return user data
    B->>JWT: Compare password hash
    JWT-->>B: Password validation result
    alt Valid credentials
        B->>JWT: Generate JWT token
        JWT-->>B: Signed JWT token
        B-->>F: { access_token: "..." }
        F->>F: Store token in localStorage/sessionStorage
        F-->>U: Redirect to dashboard
    else Invalid credentials
        B-->>F: 401 Unauthorized
        F-->>U: Show error message
    end
```

## Password Hashing Workflow

```mermaid
flowchart TD
    A[User Registration/Login] --> B{Action Type}
    B --> C[Registration]
    B --> D[Login]
    
    C --> E[Receive plain text password]
    E --> F[Generate salt]
    F --> G[Hash password with salt]
    G --> H[Store hash in database]
    H --> I[User account created]
    
    D --> J[Receive plain text password]
    J --> K[Retrieve stored hash from DB]
    K --> L[Extract salt from hash]
    L --> M[Hash input with same salt]
    M --> N[Compare hashes]
    N --> O{Hashes match?}
    O -- Yes --> P[Authentication successful]
    O -- No --> Q[Authentication failed]
    
    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#bbdefb
    style E fill:#fff3e0
    style F fill:#c8e6c9
    style G fill:#c8e6c9
    style H fill:#c8e6c9
    style I fill:#c8e6c9
    style J fill:#fff3e0
    style K fill:#bbdefb
    style L fill:#bbdefb
    style M fill:#bbdefb
    style N fill:#bbdefb
    style O fill:#f3e5f5
    style P fill:#c8e6c9
    style Q fill:#ffcdd2
```

## JWT Token Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant JWT_LIB as JWT Library
    
    U->>F: Login with credentials
    F->>B: POST /api/auth/login
    B->>B: Validate credentials
    B->>JWT_LIB: Sign payload with secret
    JWT_LIB-->>B: JWT Token
    B-->>F: { access_token: "JWT_TOKEN" }
    F->>F: Store token
    F->>B: GET /api/suppliers (with Authorization header)
    B->>JWT_LIB: Verify token with secret
    JWT_LIB-->>B: Decoded payload
    B->>B: Check user permissions
    B->>DB: Query suppliers
    DB-->>B: Suppliers data
    B-->>F: Suppliers JSON
    F-->>U: Display suppliers
```

## API Request/Response Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as MySQL
    
    U->>F: Click "View Suppliers"
    F->>B: GET /api/suppliers (with JWT)
    B->>B: Validate JWT token
    B->>DB: SELECT * FROM suppliers
    DB-->>B: Suppliers data
    B->>B: Format response
    B-->>F: JSON response
    F->>F: Process data
    F-->>U: Render suppliers list
    
    U->>F: Click "Add Supplier"
    F->>F: Show form
    U->>F: Fill form and submit
    F->>B: POST /api/suppliers (with JWT and data)
    B->>B: Validate JWT token
    B->>B: Validate input data
    B->>DB: INSERT INTO suppliers
    DB-->>B: Success/failure
    B-->>F: Success/failure response
    F-->>U: Show success/error message
```

## Purchase Order Creation Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as MySQL
    
    U->>F: Initiate PO creation
    F->>B: POST /api/purchase-orders (with JWT and data)
    B->>B: Validate JWT token
    B->>B: Validate input data
    B->>DB: Begin transaction
    DB-->>B: Transaction started
    B->>DB: INSERT INTO purchase_orders
    DB-->>B: PO ID
    loop For each line item
        B->>DB: INSERT INTO purchase_order_items
        DB-->>B: Item ID
    end
    B->>DB: Commit transaction
    DB-->>B: Success
    B-->>F: Created PO with items
    F-->>U: Show success message
```

## Invoice & Payment Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as MySQL
    
    U->>F: Create invoice for PO
    F->>B: POST /api/invoices (with JWT and data)
    B->>B: Validate JWT token
    B->>B: Validate input data
    B->>DB: INSERT INTO invoices
    DB-->>B: Invoice created
    B-->>F: Created invoice
    F-->>U: Show invoice details
    
    U->>F: Record payment
    F->>B: POST /api/payments (with JWT and data)
    B->>B: Validate JWT token
    B->>B: Validate input data
    B->>DB: INSERT INTO payments
    DB-->>B: Payment recorded
    B-->>F: Payment confirmation
    F-->>U: Show payment success
```

## Database Seeding Workflow

```mermaid
sequenceDiagram
    participant D as Developer
    participant S as Seeding Script
    participant A as AppModule
    participant R as Repositories
    participant DB as MySQL
    
    D->>S: Run seed script
    S->>A: Create application context
    A-->>S: Application instance
    S->>S: Get repository tokens
    S->>R: Get repositories
    R-->>S: Repository instances
    S->>S: Create seed data
    loop For each entity type
        S->>DB: Insert roles
        DB-->>S: Roles inserted
        S->>DB: Insert users
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
    S-->>D: Seeding completed
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

## Testing Workflow

```mermaid
flowchart TD
    A[Developer] --> B[Write Test Cases]
    B --> C[Run Tests]
    C --> D{Tests Pass?}
    D -- Yes --> E[Commit Code]
    D -- No --> F[Debug & Fix]
    F --> C
    E --> G[CI/CD Pipeline]
    G --> H{Automated Tests Pass?}
    H -- Yes --> I[Deploy]
    H -- No --> J[Notify Developer]
    J --> F
```