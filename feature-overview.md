# Feature Overview (FRD)

This document shows what the system does from a user's point of view, covering all available features and functionalities.

### User Roles

The system implements role-based access control with the following roles:

| Role | Key Responsibilities |
|------|---------------------|
| **Administrator** | Full system access, including user management, supplier management, product management, purchase order management, invoice management, and payment processing. |
| **Procurement Manager** | Manages suppliers, products, categories, and purchase orders. Can view invoices and payments. |
| **Finance User** | Manages invoices and payments. Can view suppliers, products, and purchase orders. |
| **Standard User** | Read-only access to view suppliers, products, purchase orders, invoices, and payments. |

### Main Features (Use Cases)

```plantuml
@startuml
left to right direction
actor Administrator as Admin
actor "Procurement Manager" as PM
actor "Finance User" as FU
actor "Standard User" as SU

rectangle "System" {
  usecase "Manage Users" as UC1
  usecase "Manage Suppliers" as UC2
  usecase "Manage Products" as UC3
  usecase "Manage Categories" as UC4
  usecase "Manage Purchase Orders" as UC5
  usecase "Manage Invoices" as UC6
  usecase "Manage Payments" as UC7
  usecase "View Reports" as UC8
}

Admin -up-> UC1
Admin --> UC2
Admin --> UC3
Admin --> UC4
Admin --> UC5
Admin --> UC6
Admin --> UC7
PM -left-> UC2
PM --> UC3
PM --> UC4
PM --> UC5
FU --> UC6
FU --> UC7
SU -down-> UC2
SU -down-> UC3
SU -down-> UC4
SU -down-> UC5
SU -down-> UC6
SU -down-> UC7
Admin --> UC8
PM --> UC8
FU --> UC8
@enduml
```

### Core Modules

#### 1. Authentication & Authorization
- User login with JWT token-based authentication
- Role-based access control for all endpoints
- Password hashing with bcrypt

#### 2. User Management
- Create, read, update, and delete users
- Assign users to roles
- View all available roles

#### 3. Supplier Management
- Create, read, update, and delete suppliers
- Maintain supplier contact information
- Track supplier ratings

#### 4. Product Management
- Create, read, update, and delete products
- Maintain product descriptions and pricing
- Organize products into categories

#### 5. Category Management
- Create and read product categories
- Associate products with multiple categories

#### 6. Purchase Order Management
- Create purchase orders with multiple line items
- Track purchase order status through its lifecycle
- Associate purchase orders with suppliers and users

#### 7. Invoice Management
- Create invoices linked to purchase orders
- Track invoice status
- View invoice details

#### 8. Payment Processing
- Record payments against invoices
- Track payment amounts and dates
- View payment history

### Purchase Order Workflow

This is the main process for creating and managing a purchase order.

#### Activity Flow
```mermaid
graph TD
    A[Start] --> B{Select Supplier};
    B --> C{Add Products};
    C --> D{Set Quantities};
    D --> E{Review};
    E -- Looks Good --> G[Submit PO];
    G --> H[PO is now 'Pending'];
    H --> I[End];
    E -- Needs Changes --> C;
```

#### PO Status Lifecycle
A purchase order moves through these states.
```mermaid
stateDiagram-v2
    [*] --> Pending
    Pending --> Approved
    Pending --> Cancelled
    Approved --> Shipped
    Approved --> Cancelled
    Shipped --> Completed
    Completed --> [*]
    Cancelled --> [*]
```

### Database Seeding
The system includes comprehensive database seeding functionality:
- Seed basic roles (Admin, Procurement Manager, Finance User, Standard User)
- Seed sample users with hashed passwords
- Seed sample suppliers with contact information
- Seed sample products with categories
- Seed sample purchase orders with line items
- Seed sample invoices and payments

This seeding functionality is useful for development, testing, and demonstration purposes.

### API Documentation
All system functionality is exposed through a RESTful API with comprehensive documentation.