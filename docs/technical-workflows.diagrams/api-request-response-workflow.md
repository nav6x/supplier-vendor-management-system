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

    Note over U, F
        User interaction flow
    end note
    
    Note over B, DB
        Backend processing flow
    end note
```