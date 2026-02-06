import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { connectToDatabase, getDatabase } from './db';
import productsRouter from './routes/products';
import cloudinaryRouter from './routes/cloudinary';
import heroSlidesRouter from './routes/heroSlides';
import ordersRouter from './routes/orders';
import categoriesRouter from './routes/categories';
import usersRouter from './routes/users';
import addressesRouter from './routes/addresses';
import adminRouter from './routes/admin';
import analyticsRouter from './routes/analytics';
import paymentRouter from './routes/payment';
import reviewsRouter from './routes/reviews';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('Environment check:', {
  MONGODB_URI: process.env.MONGODB_URI ? '✓ Loaded' : '✗ Missing',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? '✓ Loaded' : '✗ Missing',
  PORT: process.env.PORT || 3001
});

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Connect to MongoDB
connectToDatabase().catch(console.error);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/cloudinary', cloudinaryRouter);
app.use('/api/hero-slides', heroSlidesRouter);
app.use('/api', ordersRouter);
app.use('/api', categoriesRouter);
app.use('/api', usersRouter);
app.use('/api', addressesRouter);
app.use('/api', adminRouter);
app.use('/api', analyticsRouter);
app.use('/api', paymentRouter);
app.use('/api', reviewsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`☁️  Cloudinary configured for image uploads`);
});
