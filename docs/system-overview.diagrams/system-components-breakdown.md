---
title: System Components Breakdown
---

```mermaid
mindmap
  root((Supplier & Vendor<br/>Management System))
    Frontend
      Static HTML/CSS/JS Files
      Bootstrap UI Framework
      REST API Client
      JWT Token Storage
    Backend
      NestJS Framework
      Controllers
      Services
      Middleware
      Auth Service
      Validation Pipes
      Configuration Module
      Database Module
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
      JWT Authentication
      Password Hashing (Bcrypt)
      Role-Based Access Control
      Input Validation (class-validator)
      Auth Middleware
    Features
      User Management
      Supplier Management
      Product Management
      Category Management
      Purchase Order Management
      Invoice Management
      Payment Processing
      Authentication
      Database Seeding
    API
      RESTful Endpoints
      JSON Communication
      HTTP Methods
      Status Codes
      Authentication Headers
    Development
      Jest Testing
      TypeScript
      TypeORM
      ESLint
      Prettier
      NestJS CLI
      Configuration Management
```

<style>
  :root {
    --primary-color: #2563eb;
    --secondary-color: #7c3aed;
    --accent-color: #059669;
    --text-color: #ffffff;
    --bg-color: #ffffff;
  }
  
  body {
    background: #ffffff;
    color: #ffffff;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 20px;
  }
  
  h1, h2, h3 {
    color: #ffffff;
    text-align: center;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  }
  
  code {
    background: #ffffff !important;
    color: #ffffff !important;
    border: 1px solid #cbd5e1 !important;
    border-radius: 6px !important;
    padding: 2px 6px !important;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  }
  
  pre {
    background: #ffffff !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 8px !important;
    padding: 16px !important;
    overflow-x: auto !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
  }
  
  .mermaid {
    background: #ffffff !important;
    border-radius: 12px !important;
    padding: 20px !important;
  }
  
  p, div, span, li {
    color: #ffffff !important;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  }
</style>