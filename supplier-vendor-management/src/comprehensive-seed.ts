import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Role } from './modules/users/entities/role.entity';
import { User } from './modules/users/entities/user.entity';
import { Supplier } from './modules/suppliers/entities/supplier.entity';
import { Product } from './modules/products/entities/product.entity';
import { Category } from './modules/products/entities/category.entity';
import { ProductCategory } from './modules/products/entities/product-category.entity';
import { PurchaseOrder } from './modules/purchase-orders/entities/purchase-order.entity';
import { PurchaseOrderItem } from './modules/purchase-orders/entities/purchase-order-item.entity';
import { Invoice } from './modules/invoices/entities/invoice.entity';
import { Payment } from './modules/payments/entities/payment.entity';
import { SupplierProduct } from './modules/suppliers/entities/supplier-product.entity';
import * as bcrypt from 'bcryptjs';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    console.log('Starting comprehensive database seeding...');
    
    const roleRepo: Repository<Role> = app.get(getRepositoryToken(Role));
    const userRepo: Repository<User> = app.get(getRepositoryToken(User));
    const supplierRepo: Repository<Supplier> = app.get(getRepositoryToken(Supplier));
    const productRepo: Repository<Product> = app.get(getRepositoryToken(Product));
    const categoryRepo: Repository<Category> = app.get(getRepositoryToken(Category));
    const productCategoryRepo: Repository<ProductCategory> = app.get(getRepositoryToken(ProductCategory));
    const purchaseOrderRepo: Repository<PurchaseOrder> = app.get(getRepositoryToken(PurchaseOrder));
    const purchaseOrderItemRepo: Repository<PurchaseOrderItem> = app.get(getRepositoryToken(PurchaseOrderItem));
    const invoiceRepo: Repository<Invoice> = app.get(getRepositoryToken(Invoice));
    const paymentRepo: Repository<Payment> = app.get(getRepositoryToken(Payment));
    const supplierProductRepo: Repository<SupplierProduct> = app.get(getRepositoryToken(SupplierProduct));
    
    console.log('Clearing existing data...');
    await paymentRepo.query('SET FOREIGN_KEY_CHECKS = 0');
    await paymentRepo.clear();
    await invoiceRepo.clear();
    await purchaseOrderItemRepo.clear();
    await purchaseOrderRepo.clear();
    await supplierProductRepo.clear();
    await productCategoryRepo.clear();
    await productRepo.clear();
    await categoryRepo.clear();
    await supplierRepo.clear();
    await userRepo.clear();
    await roleRepo.clear();
    await paymentRepo.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Creating roles...');
    const adminRole = roleRepo.create({ roleName: 'Administrator' });
    const procurementRole = roleRepo.create({ roleName: 'Procurement Manager' });
    const financeRole = roleRepo.create({ roleName: 'Finance User' });
    const standardRole = roleRepo.create({ roleName: 'Standard User' });
    
    await roleRepo.save([adminRole, procurementRole, financeRole, standardRole]);
    
    console.log('Creating users...');
    const hashedPassword = await bcrypt.hash('password', 10);
    const users = [
      userRepo.create({ username: 'admin', email: 'admin@example.com', passwordHash: hashedPassword, roleId: adminRole.id }),
      userRepo.create({ username: 'procurement1', email: 'procurement1@example.com', passwordHash: hashedPassword, roleId: procurementRole.id }),
      userRepo.create({ username: 'procurement2', email: 'procurement2@example.com', passwordHash: hashedPassword, roleId: procurementRole.id }),
      userRepo.create({ username: 'finance1', email: 'finance1@example.com', passwordHash: hashedPassword, roleId: financeRole.id }),
      userRepo.create({ username: 'finance2', email: 'finance2@example.com', passwordHash: hashedPassword, roleId: financeRole.id }),
      userRepo.create({ username: 'standard1', email: 'standard1@example.com', passwordHash: hashedPassword, roleId: standardRole.id }),
      userRepo.create({ username: 'standard2', email: 'standard2@example.com', passwordHash: hashedPassword, roleId: standardRole.id })
    ];
    
    await userRepo.save(users);
    
    console.log('Creating suppliers...');
    const suppliers = [
      supplierRepo.create({ 
        name: 'ABC Supplies Co.', 
        email: 'contact@abcsupplies.com', 
        contactPerson: 'John Smith', 
        phone: '123-456-7890', 
        address: '123 Main St, City, State 12345', 
        rating: 4 
      }),
      supplierRepo.create({ 
        name: 'XYZ Manufacturing', 
        email: 'info@xyzmanufacturing.com', 
        contactPerson: 'Jane Doe', 
        phone: '098-765-4321', 
        address: '456 Industrial Blvd, City, State 12345', 
        rating: 5 
      }),
      supplierRepo.create({ 
        name: 'Global Tech Solutions', 
        email: 'sales@globaltech.com', 
        contactPerson: 'Robert Johnson', 
        phone: '555-123-4321', 
        address: '789 Tech Park, City, State 67890', 
        rating: 3 
      }),
      supplierRepo.create({ 
        name: 'Office Plus Inc.', 
        email: 'orders@officeplus.com', 
        contactPerson: 'Sarah Williams', 
        phone: '888-999-0000', 
        address: '321 Business Ave, City, State 54321', 
        rating: 4 
      }),
      supplierRepo.create({ 
        name: 'Industrial Equipment Ltd.', 
        email: 'info@industrialequip.com', 
        contactPerson: 'Michael Brown', 
        phone: '777-888-9999', 
        address: '654 Factory Road, City, State 98765', 
        rating: 5 
      })
    ];
    
    await supplierRepo.save(suppliers);
    
    console.log('Creating categories...');
    const categories = [
      categoryRepo.create({ name: 'Electronics' }),
      categoryRepo.create({ name: 'Office Supplies' }),
      categoryRepo.create({ name: 'Furniture' }),
      categoryRepo.create({ name: 'Software' }),
      categoryRepo.create({ name: 'Maintenance' }),
      categoryRepo.create({ name: 'Consulting Services' }),
      categoryRepo.create({ name: 'Networking' }),
      categoryRepo.create({ name: 'Security' })
    ];
    
    await categoryRepo.save(categories);
    
    console.log('Creating products...');
    const products = [
      productRepo.create({ name: 'Business Laptop', description: 'High-performance laptop for business use', price: 1299.99 }),
      productRepo.create({ name: 'Executive Desk', description: 'Premium executive desk with storage', price: 899.99 }),
      productRepo.create({ name: 'Office Chair', description: 'Ergonomic office chair', price: 299.99 }),
      productRepo.create({ name: 'Monitor', description: '24-inch LED monitor', price: 199.99 }),
      productRepo.create({ name: 'Wireless Keyboard', description: 'Ergonomic wireless keyboard', price: 89.99 }),
      productRepo.create({ name: 'Wireless Mouse', description: 'Precision wireless mouse', price: 49.99 }),
      productRepo.create({ name: 'Desk Lamp', description: 'Adjustable LED desk lamp', price: 39.99 }),
      productRepo.create({ name: 'Filing Cabinet', description: '3-drawer vertical filing cabinet', price: 149.99 }),
      productRepo.create({ name: 'Bookshelf', description: '5-shelf wooden bookshelf', price: 199.99 }),
      productRepo.create({ name: 'Conference Table', description: 'Large conference table for meetings', price: 799.99 }),
      productRepo.create({ name: 'Projector', description: 'HD projector for presentations', price: 499.99 }),
      productRepo.create({ name: 'Whiteboard', description: 'Magnetic whiteboard 4x6 feet', price: 129.99 }),
      productRepo.create({ name: 'Office Software Suite', description: 'Complete office productivity software', price: 199.99 }),
      productRepo.create({ name: 'Antivirus Software', description: 'Enterprise antivirus protection', price: 89.99 }),
      productRepo.create({ name: 'Accounting Software', description: 'Professional accounting software', price: 299.99 }),
      productRepo.create({ name: 'Consulting Services', description: 'Professional business consulting', price: 150.00 }),
      productRepo.create({ name: 'IT Support', description: 'Technical support services', price: 75.00 }),
      productRepo.create({ name: 'Maintenance Service', description: 'Equipment maintenance service', price: 100.00 }),
      productRepo.create({ name: 'Network Switch', description: '24-port gigabit network switch', price: 249.99 }),
      productRepo.create({ name: 'Router', description: 'Enterprise-grade wireless router', price: 199.99 })
    ];
    
    await productRepo.save(products);
    
    console.log('Creating product-category relationships...');
    const productCategories = [];
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const categoryIndex = i % categories.length;
      const category = categories[categoryIndex];
      productCategories.push(productCategoryRepo.create({ 
        productId: product.id, 
        categoryId: category.id 
      }));
    }
    
    await productCategoryRepo.save(productCategories);
    
    console.log('Creating supplier-product relationships...');
    const supplierProducts = [];
    for (let i = 0; i < suppliers.length; i++) {
      const supplier = suppliers[i];
      for (let j = 0; j < 8; j++) {
        const productIndex = (i * 3 + j) % products.length;
        const product = products[productIndex];
        supplierProducts.push(supplierProductRepo.create({ 
          supplierId: supplier.id, 
          productId: product.id,
          price: product.price * (0.9 + Math.random() * 0.2)
        }));
      }
    }
    
    await supplierProductRepo.save(supplierProducts);
    
    console.log('Creating purchase orders...');
    const purchaseOrders = [];
    const statuses = ['Pending', 'Approved', 'Shipped', 'Completed', 'Cancelled'];
    
    for (let i = 0; i < 15; i++) {
      const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
      const createdBy = users.filter(u => u.roleId === procurementRole.id)[Math.floor(Math.random() * 2)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));
      
      purchaseOrders.push(purchaseOrderRepo.create({ 
        supplierId: supplier.id, 
        createdById: createdBy.id, 
        orderDate: orderDate, 
        status: status 
      }));
    }
    
    await purchaseOrderRepo.save(purchaseOrders);
    
    console.log('Creating purchase order items...');
    const purchaseOrderItems = [];
    for (let i = 0; i < purchaseOrders.length; i++) {
      const purchaseOrder = purchaseOrders[i];
      const itemCount = 1 + Math.floor(Math.random() * 3);
      
      for (let j = 0; j < itemCount; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = 1 + Math.floor(Math.random() * 10);
        const unitPrice = product.price * (0.9 + Math.random() * 0.2);
        
        purchaseOrderItems.push(purchaseOrderItemRepo.create({ 
          purchaseOrderId: purchaseOrder.id, 
          productId: product.id, 
          quantity: quantity, 
          unitPrice: unitPrice 
        }));
      }
    }
    
    await purchaseOrderItemRepo.save(purchaseOrderItems);
    
    console.log('Creating invoices...');
    const invoices = [];
    for (let i = 0; i < purchaseOrders.length; i++) {
      const purchaseOrder = purchaseOrders[i];
      if (purchaseOrder.status !== 'Cancelled') {
        const invoiceDate = new Date(purchaseOrder.orderDate);
        invoiceDate.setDate(invoiceDate.getDate() + 7);
        
        const dueDate = new Date(invoiceDate);
        dueDate.setDate(dueDate.getDate() + 30);
        
        const statuses = ['Pending', 'Paid', 'Overdue'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        invoices.push(invoiceRepo.create({ 
          purchaseOrderId: purchaseOrder.id, 
          invoiceDate: invoiceDate, 
          dueDate: dueDate, 
          status: status 
        }));
      }
    }
    
    await invoiceRepo.save(invoices);
    
    console.log('Creating payments...');
    const payments = [];
    for (let i = 0; i < invoices.length; i++) {
      const invoice = invoices[i];
      if (invoice.status === 'Paid') {
        const paymentDate = new Date(invoice.dueDate);
        paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 10));
        
        const poItems = purchaseOrderItems.filter(item => 
          item.purchaseOrderId === invoice.purchaseOrderId
        );
        
        const amount = poItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        
        payments.push(paymentRepo.create({ 
          invoiceId: invoice.id, 
          paymentDate: paymentDate, 
          amount: amount 
        }));
      }
    }
    
    await paymentRepo.save(payments);
    
    console.log('Comprehensive database seeding completed successfully!');
    console.log(`Seeded data for all 11 tables:`);
    console.log(`- ${await roleRepo.count()} roles`);
    console.log(`- ${await userRepo.count()} users`);
    console.log(`- ${await supplierRepo.count()} suppliers`);
    console.log(`- ${await categoryRepo.count()} categories`);
    console.log(`- ${await productRepo.count()} products`);
    console.log(`- ${await productCategoryRepo.count()} product-category relationships`);
    console.log(`- ${await supplierProductRepo.count()} supplier-product relationships`);
    console.log(`- ${await purchaseOrderRepo.count()} purchase orders`);
    console.log(`- ${await purchaseOrderItemRepo.count()} purchase order items`);
    console.log(`- ${await invoiceRepo.count()} invoices`);
    console.log(`- ${await paymentRepo.count()} payments`);
    
  } catch (error) {
    console.error('Error during database seeding:', error);
  } finally {
    await app.close();
  }
}

bootstrap();