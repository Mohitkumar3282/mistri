import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import mistriRoutes from './routes/mistriRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

// Import Middlewares
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
    app: 'Mistri Home Services & Technician Booking API',
    architecture: 'MVC (Model-View-Controller)',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      services: '/api/services',
      mistris: '/api/mistris',
      bookings: '/api/bookings',
    },
  });
});

// Mount MVC API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/mistris', mistriRoutes);
app.use('/api/bookings', bookingRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Mistri Backend Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📡 API Base: http://localhost:${PORT}`);
});
