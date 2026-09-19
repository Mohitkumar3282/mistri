import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import mistriRoutes from './routes/mistriRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Import Middlewares
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(
  cors({
    origin: '*', // Allow requests from frontend
    credentials: true,
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Root / Health Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'Mistri Construction & Technician Booking API',
    architecture: 'MVC (Model-View-Controller)',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
      services: '/api/services',
      mistris: '/api/mistris',
      bookings: '/api/bookings',
      admin: '/api/admin',
      payments: '/api/payments',
      upload: '/api/upload',
    },
  });
});

// Mount MVC API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/mistris', mistriRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Mistri Backend Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📡 API Base: http://localhost:${PORT}`);
});
