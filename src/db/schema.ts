import { pgTable, serial, text, integer, timestamp, boolean, doublePrecision, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const orderStatusEnum = pgEnum('order_status', ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']);
export const paymentStatusEnum = pgEnum('payment_status', ['Pending', 'Completed', 'Failed', 'Refunded']);

// Profiles (Admins/Owners)
export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase UID
  email: text('email').notNull(),
  role: text('role', { enum: ['admin', 'owner', 'customer'] }).default('customer').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Products
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: doublePrecision('price').notNull(),
  weight: text('weight'),
  stock: integer('stock').default(0).notNull(),
  image: text('image'), // URL to image
  category: text('category'),
  ingredients: text('ingredients'),
  allergens: text('allergens'),
  nutrition: text('nutrition'),
  isBestSeller: boolean('is_best_seller').default(false).notNull(),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Customers (Public users who buy)
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  uid: text('uid').unique(), // Optional for guest checkout, but used for registered
  email: text('email').notNull(),
  fullName: text('full_name'),
  phone: text('phone'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  pincode: text('pincode'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Orders
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id).notNull(),
  totalAmount: doublePrecision('total_amount').notNull(),
  status: orderStatusEnum('status').default('Pending').notNull(),
  shippingDetails: text('shipping_details'), // JSON string or text summary
  paymentMethod: text('payment_method').notNull(), // UPI, COD, etc
  razorpayOrderId: text('razorpay_order_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Order Items
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  priceAtTime: doublePrecision('price_at_time').notNull(),
});

// Payments
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  status: paymentStatusEnum('status').default('Pending').notNull(),
  amount: doublePrecision('amount').notNull(),
  razorpayPaymentId: text('razorpay_payment_id'),
  razorpaySignature: text('razorpay_signature'),
  provider: text('provider').default('razorpay').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Homepage Banners
export const banners = pgTable('banners', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  image: text('image').notNull(),
  link: text('link'),
  active: boolean('active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
  payment: one(payments, {
    fields: [orders.id],
    references: [payments.orderId],
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
