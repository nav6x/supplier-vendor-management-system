import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { ProductsModule } from './modules/products/products.module';
import { PurchaseOrdersModule } from './modules/purchase-orders/purchase-orders.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { DatabaseModule } from './database/database.module';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    SuppliersModule,
    ProductsModule,
    PurchaseOrdersModule,
    InvoicesModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'users', method: RequestMethod.ALL },
        { path: 'users/*', method: RequestMethod.ALL },
        { path: 'suppliers', method: RequestMethod.ALL },
        { path: 'suppliers/*', method: RequestMethod.ALL },
        { path: 'products', method: RequestMethod.ALL },
        { path: 'products/*', method: RequestMethod.ALL },
        { path: 'purchase-orders', method: RequestMethod.ALL },
        { path: 'purchase-orders/*', method: RequestMethod.ALL },
        { path: 'invoices', method: RequestMethod.ALL },
        { path: 'invoices/*', method: RequestMethod.ALL },
        { path: 'payments', method: RequestMethod.ALL },
        { path: 'payments/*', method: RequestMethod.ALL },
      );
  }
}