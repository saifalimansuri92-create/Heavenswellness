import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { db, schema } from './src/db/index.ts';
import { products, orders, orderItems, customers, payments, profiles, banners } from './src/db/schema.ts';
import { eq, desc, sql, and } from 'drizzle-orm';
import { requireAuth, requireAdmin } from './src/middleware/auth.ts';
import Razorpay from 'razorpay';

dotenv.config();

const app = express();
app.use(express.json());

// Gemini Setup
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: { 'User-Agent': 'aistudio-build' },
  },
});

// Razorpay Setup (Placeholder)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder',
});

// --- SHOP API ---

app.get('/api/products', async (req, res) => {
  try {
    const list = await db.select().from(products).where(eq(products.active, true));
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const [item] = await db.select().from(products).where(eq(products.id, parseInt(req.params.id)));
    if (!item) return res.status(404).json({ error: 'Product not found' });
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/banners', async (req, res) => {
  try {
    const list = await db.select().from(banners).where(eq(banners.active, true)).orderBy(banners.sortOrder);
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Checkout & Orders
app.post('/api/orders', requireAuth, async (req: any, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    
    // 1. Get or Create Customer
    let [customer] = await db.select().from(customers).where(eq(customers.email, req.user.email));
    if (!customer) {
      [customer] = await db.insert(customers).values({
        uid: req.user.uid,
        email: req.user.email,
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        address: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode
      }).returning();
    }

    // 2. Calculate Total
    let total = 0;
    const itemsToInsert = [];
    for (const item of items) {
      const [prod] = await db.select().from(products).where(eq(products.id, item.id));
      if (!prod || prod.stock < item.quantity) throw new Error(`Product ${prod?.name} out of stock`);
      total += prod.price * item.quantity;
      itemsToInsert.push({ productId: prod.id, quantity: item.quantity, priceAtTime: prod.price });
    }
    const finalAmount = total > 2000 ? total : total + 150;

    // 3. Create Order
    const [order] = await db.insert(orders).values({
      customerId: customer.id,
      totalAmount: finalAmount,
      status: 'Pending',
      paymentMethod,
      shippingDetails: JSON.stringify(shippingAddress)
    }).returning();

    // 4. Create Order Items
    for (const oi of itemsToInsert) {
      await db.insert(orderItems).values({ ...oi, orderId: order.id });
      // Update stock
      await db.update(products).set({ stock: sql`${products.stock} - ${oi.quantity}` }).where(eq(products.id, oi.productId));
    }

// Razorpay Order (if not COD)
    let rpOrder = null;
    if (paymentMethod !== 'COD') {
      rpOrder = await razorpay.orders.create({
        amount: Math.round(finalAmount * 100),
        currency: 'INR',
        receipt: `order_rcptid_${order.id}`
      });
      await db.update(orders).set({ razorpayOrderId: rpOrder.id }).where(eq(orders.id, order.id));
    }

    res.json({ orderId: order.id, razorpayOrder: rpOrder });
  } catch (error: any) {
    console.error('Order Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/payments/verify', requireAuth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    
    // 1. Verify Signature
    const crypto = await import('crypto');
    const secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder';
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // 2. Update Order and Create Payment Record
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    if (!order) return res.status(404).json({ error: 'Order not found' });

    await db.update(orders).set({ status: 'Confirmed' }).where(eq(orders.id, orderId));
    
    await db.insert(payments).values({
      orderId,
      status: 'Completed',
      amount: order.totalAmount,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      provider: 'razorpay'
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Razorpay Webhook
app.post('/api/webhooks/razorpay', async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'placeholder';
  const signature = req.headers['x-razorpay-signature'];

  try {
    const crypto = await import('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).send('Invalid signature');
    }

    const { event, payload } = req.body;
    if (event === 'payment.captured') {
      const orderId = payload.payment.entity.order_id;
      // Find order by razorpayOrderId and update status
      const [order] = await db.select().from(orders).where(eq(orders.razorpayOrderId, orderId));
      if (order) {
        await db.update(orders).set({ status: 'Confirmed' }).where(eq(orders.id, order.id));
        // Add payment record if not exists
        const [existingPayment] = await db.select().from(payments).where(eq(payments.razorpayPaymentId, payload.payment.entity.id));
        if (!existingPayment) {
          await db.insert(payments).values({
            orderId: order.id,
            status: 'Completed',
            amount: payload.payment.entity.amount / 100,
            razorpayPaymentId: payload.payment.entity.id,
            provider: 'razorpay'
          });
        }
      }
    }
    res.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    res.status(500).send('Webhook failed');
  }
});



// --- ADMIN API ---

app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    const [ordersCount] = await db.select({ count: sql<number>`count(*)` }).from(orders);
    const [salesSum] = await db.select({ sum: sql<number>`sum(total_amount)` }).from(orders);
    const [customersCount] = await db.select({ count: sql<number>`count(*)` }).from(customers);
    const [productsCount] = await db.select({ count: sql<number>`count(*)` }).from(products);
    
    res.json({
      totalOrders: ordersCount.count,
      totalSales: salesSum.sum || 0,
      totalCustomers: customersCount.count,
      totalProducts: productsCount.count
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/orders', requireAdmin, async (req, res) => {
  try {
    const list = await db.query.orders.findMany({
      with: { 
        customer: true, 
        items: { with: { product: true } },
        payment: true
      },
      orderBy: desc(orders.createdAt)
    });
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


app.patch('/api/admin/orders/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await db.update(orders).set({ status }).where(eq(orders.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/products', requireAdmin, async (req, res) => {
  try {
    const list = await db.select().from(products).orderBy(desc(products.createdAt));
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/products', requireAdmin, async (req, res) => {
  try {
    const [item] = await db.insert(products).values(req.body).returning();
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/admin/products/:id', requireAdmin, async (req, res) => {
  try {
    const [item] = await db.update(products).set(req.body).where(eq(products.id, parseInt(req.params.id))).returning();
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/products/:id', requireAdmin, async (req, res) => {
  try {
    await db.delete(products).where(eq(products.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Chat API
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const systemInstruction = `You are the "Celestial Sommelier" for HEAVENS WELLNESS. 
     Tone: Elegant, sophisticated. 
     Help customers discover the "Midnight Mood" collection.
     Use Google Search for chocolate trends/facts.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: messages,
      config: { systemInstruction, tools: [{ googleSearch: {} }] },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const path = await import('path');
    const fs = await import('fs/promises');
    // Serve static assets from dist
    app.use(express.static(path.resolve('dist'), { index: false }));
    
    // Fallback for SPA routing
    app.get('*', async (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      try {
        const html = await fs.readFile(path.resolve('dist/index.html'), 'utf-8');
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        res.status(500).end('Production build (dist/index.html) not found. Run npm run build.');
      }
    });
  }

  const port = parseInt(process.env.PORT || '3000');
  app.listen(port, '0.0.0.0', () => console.log(`Server running in ${isProd ? 'production' : 'development'} mode at http://0.0.0.0:${port}`));
}

startServer();
