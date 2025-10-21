import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import axios from 'axios';
import productsRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import ordersRoutes from './routes/orders.js';
import authRoutes from './routes/auth.js';
import paymentRoutes from './routes/payment.js';
import Product from './models/Product.js';

const app = express();

app.use(cors());

// Raw body parser for Stripe webhook (must come before express.json())
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// JSON body parser for all other routes
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in the environment variables');
}

// Function to seed the database if it's empty
const seedDatabase = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Database is empty. Seeding with sample products...');
      const response = await axios.get('https://fakestoreapi.com/products');
      const apiProducts = response.data;

      const productsToSeed = apiProducts.map(apiProduct => ({
        name: apiProduct.title,
        description: apiProduct.description,
        price: apiProduct.price,
        category: apiProduct.category,
        imageUrl: apiProduct.image,
        sizes: ["S", "M", "L"],
        colors: ["Black", "White", "Blue"],
        inStock: true,
        featured: apiProduct.rating.count > 100,
      }));

      await Product.insertMany(productsToSeed);
      console.log('✅ Database seeded successfully!');
    } else {
      console.log('Database already contains products. Skipping seeding.');
    }
  } catch (err) {
    console.error('❌ Error during database seeding:', err);
  }
};

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully.');
    seedDatabase();
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('AuraShop API is running!');
});

// New Image Proxy Route
app.get('/images/:imageName', async (req, res) => {
  try {
    const { imageName } = req.params;
    const imageUrl = `https://fakestoreapi.com/img/${imageName}`;
    const response = await axios.get(imageUrl, { responseType: 'stream' });
    res.setHeader('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (error) {
    res.status(500).send('Error fetching image');
  }
});

app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`⚡️ Server is running on http://localhost:${PORT}`);
});