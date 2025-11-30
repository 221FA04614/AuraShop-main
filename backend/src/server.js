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
      // Fetch 100 products from dummyjson
      const response = await axios.get('https://dummyjson.com/products?limit=100');
      const apiProducts = response.data.products;

      const productsToSeed = apiProducts.map(apiProduct => ({
        name: apiProduct.title,
        description: apiProduct.description,
        price: apiProduct.price,
        category: apiProduct.category,
        // Use the first image or thumbnail
        imageUrl: apiProduct.images && apiProduct.images.length > 0 ? apiProduct.images[0] : apiProduct.thumbnail,
        // Add default sizes and colors since dummyjson doesn't provide them
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "White", "Blue", "Red"],
        inStock: true,
        // Feature products with high rating
        featured: apiProduct.rating > 4.5,
      }));
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
            // Fetch 100 products from dummyjson
            const response = await axios.get('https://dummyjson.com/products?limit=100');
            const apiProducts = response.data.products;

            const productsToSeed = apiProducts.map(apiProduct => ({
              name: apiProduct.title,
              description: apiProduct.description,
              price: apiProduct.price,
              category: apiProduct.category,
              // Use the first image or thumbnail
              imageUrl: apiProduct.images && apiProduct.images.length > 0 ? apiProduct.images[0] : apiProduct.thumbnail,
              // Add default sizes and colors since dummyjson doesn't provide them
              sizes: ["S", "M", "L", "XL"],
              colors: ["Black", "White", "Blue", "Red"],
              inStock: true,
              // Feature products with high rating
              featured: apiProduct.rating > 4.5,
            }));

            await Product.insertMany(productsToSeed);
            console.log('✅ Database seeded successfully with 100 products!');
          } else {
            console.log('Database already contains products. Skipping seeding.');
          }
        } catch (err) {
          console.error('❌ Error during database seeding:', err);
        }
      };

      const PORT = process.env.PORT || 5000;

      import path from 'path';
      import { fileURLToPath } from 'url';

      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      // Connect to MongoDB then start server
      mongoose.connect(MONGODB_URI)
        .then(() => {
          console.log('✅ MongoDB connected successfully.');
          seedDatabase();

          app.listen(PORT, () => {
            console.log(`⚡️ Server is running on http://localhost:${PORT}`);
          });
        })
        .catch(err => {
          console.error('❌ MongoDB connection error:', err);
          process.exit(1); // Exit if DB fails
        });

      // New Image Proxy Route
      app.get('/images/:imageName', async (req, res) => {
        try {
          const { imageName } = req.params;
          res.status(404).send('Image proxy not supported for external URLs yet.');
        } catch (error) {
          res.status(500).send('Error fetching image');
        }
      });

      app.use('/api/products', productsRoutes);
      app.use('/api/cart', cartRoutes);
      app.use('/api/orders', ordersRoutes);
      app.use('/api/auth', authRoutes);
      app.use('/api/payment', paymentRoutes);

      // Serve static assets in production
      if (process.env.NODE_ENV === 'production') {
        // Set static folder
        app.use(express.static(path.join(__dirname, '../../client/dist')));

        // Any route that is not an API route will be handled by the React app
        app.get('*', (req, res) => {
          res.sendFile(path.resolve(__dirname, '../../client', 'dist', 'index.html'));
        });
      } else {
        app.get('/', (req, res) => {
          res.send('AuraShop API is running!');
        });
      }