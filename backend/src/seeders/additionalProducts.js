import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const additionalProducts = [
  // Home & Living Category
  {
    name: "Luxury Throw Blanket",
    description: "Soft and cozy throw blanket perfect for your living room. Made with premium materials for ultimate comfort.",
    price: 49.99,
    category: "home & living",
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500",
    sizes: ["Standard"],
    colors: ["Gray", "Beige", "Navy"],
    inStock: true,
    stock: 50,
    featured: false
  },
  {
    name: "Ceramic Vase Set",
    description: "Modern ceramic vase set of 3, perfect for home decoration. Adds elegance to any room.",
    price: 34.99,
    category: "home & living",
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500",
    sizes: ["Small", "Medium", "Large"],
    colors: ["White", "Gray", "Black"],
    inStock: true,
    stock: 30,
    featured: false
  },
  {
    name: "Aromatherapy Diffuser",
    description: "Essential oil diffuser with LED lights. Creates a relaxing atmosphere in your home.",
    price: 29.99,
    category: "home & living",
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500",
    sizes: ["Standard"],
    colors: ["White", "Black", "Wood"],
    inStock: true,
    stock: 75,
    featured: true
  },

  // Sports & Outdoors Category
  {
    name: "Yoga Mat Premium",
    description: "Non-slip yoga mat with extra cushioning. Perfect for yoga, pilates, and home workouts.",
    price: 39.99,
    category: "sports & outdoors",
    imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
    sizes: ["Standard"],
    colors: ["Purple", "Blue", "Green", "Pink"],
    inStock: true,
    stock: 100,
    featured: true
  },
  {
    name: "Water Bottle Insulated",
    description: "Stainless steel insulated water bottle. Keeps drinks cold for 24 hours or hot for 12 hours.",
    price: 24.99,
    category: "sports & outdoors",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
    sizes: ["500ml", "750ml", "1L"],
    colors: ["Black", "Blue", "Red", "Silver"],
    inStock: true,
    stock: 150,
    featured: false
  },
  {
    name: "Camping Tent 4-Person",
    description: "Waterproof camping tent for 4 people. Easy setup with spacious interior.",
    price: 129.99,
    category: "sports & outdoors",
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500",
    sizes: ["Standard"],
    colors: ["Green", "Blue", "Orange"],
    inStock: true,
    stock: 25,
    featured: false
  },

  // Books & Media Category
  {
    name: "Hardcover Journal",
    description: "Premium leather-bound journal with lined pages. Perfect for writing, sketching, or planning.",
    price: 19.99,
    category: "books & media",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500",
    sizes: ["A5", "A4"],
    colors: ["Brown", "Black", "Tan"],
    inStock: true,
    stock: 80,
    featured: false
  },
  {
    name: "Bookmark Set Premium",
    description: "Set of 5 metal bookmarks with inspirational quotes. Elegant gift for book lovers.",
    price: 14.99,
    category: "books & media",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500",
    sizes: ["Standard"],
    colors: ["Gold", "Silver", "Bronze"],
    inStock: true,
    stock: 120,
    featured: false
  },

  // Toys & Games Category
  {
    name: "Puzzle 1000 Pieces",
    description: "Beautiful landscape jigsaw puzzle with 1000 pieces. Great family activity.",
    price: 24.99,
    category: "toys & games",
    imageUrl: "https://images.unsplash.com/photo-1609367183925-376b5f48bedf?w=500",
    sizes: ["Standard"],
    colors: ["Multicolor"],
    inStock: true,
    stock: 60,
    featured: false
  },
  {
    name: "Board Game Strategy",
    description: "Award-winning strategy board game for 2-4 players. Hours of entertainment for the whole family.",
    price: 44.99,
    category: "toys & games",
    imageUrl: "https://images.unsplash.com/photo-1611891487795-dde8e6e4a071?w=500",
    sizes: ["Standard"],
    colors: ["Multicolor"],
    inStock: true,
    stock: 40,
    featured: true
  },

  // Beauty & Health Category
  {
    name: "Skincare Set Complete",
    description: "Complete skincare routine set including cleanser, toner, serum, and moisturizer.",
    price: 79.99,
    category: "beauty & health",
    imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500",
    sizes: ["Standard"],
    colors: ["N/A"],
    inStock: true,
    stock: 45,
    featured: true
  },
  {
    name: "Massage Gun Pro",
    description: "Deep tissue massage gun with 6 speed settings. Perfect for muscle recovery and relaxation.",
    price: 89.99,
    category: "beauty & health",
    imageUrl: "https://images.unsplash.com/photo-1608839821253-56b2c8b0c48e?w=500",
    sizes: ["Standard"],
    colors: ["Black", "Gray", "White"],
    inStock: true,
    stock: 35,
    featured: false
  },
  {
    name: "Essential Oils Set",
    description: "Set of 10 pure essential oils. Perfect for aromatherapy, diffusers, and relaxation.",
    price: 34.99,
    category: "beauty & health",
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500",
    sizes: ["10ml"],
    colors: ["N/A"],
    inStock: true,
    stock: 70,
    featured: false
  },

  // Automotive Category
  {
    name: "Car Phone Holder",
    description: "Universal car phone mount with 360-degree rotation. Secure grip and easy installation.",
    price: 19.99,
    category: "automotive",
    imageUrl: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500",
    sizes: ["Standard"],
    colors: ["Black", "Silver"],
    inStock: true,
    stock: 100,
    featured: false
  },
  {
    name: "Car Vacuum Cleaner",
    description: "Portable car vacuum cleaner with powerful suction. Cordless and rechargeable.",
    price: 49.99,
    category: "automotive",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500",
    sizes: ["Standard"],
    colors: ["Black", "Gray"],
    inStock: true,
    stock: 55,
    featured: false
  },

  // Pet Supplies Category
  {
    name: "Pet Bed Orthopedic",
    description: "Comfortable orthopedic pet bed with memory foam. Perfect for dogs and cats.",
    price: 59.99,
    category: "pet supplies",
    imageUrl: "https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?w=500",
    sizes: ["Small", "Medium", "Large"],
    colors: ["Gray", "Brown", "Blue"],
    inStock: true,
    stock: 40,
    featured: false
  },
  {
    name: "Interactive Pet Toy",
    description: "Automatic interactive toy for cats and dogs. Keeps pets entertained for hours.",
    price: 29.99,
    category: "pet supplies",
    imageUrl: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=500",
    sizes: ["Standard"],
    colors: ["Blue", "Pink", "Green"],
    inStock: true,
    stock: 65,
    featured: false
  },
  {
    name: "Pet Water Fountain",
    description: "Automatic pet water fountain with filter. Encourages pets to drink more water.",
    price: 39.99,
    category: "pet supplies",
    imageUrl: "https://images.unsplash.com/photo-1591856419583-8eb1f6df5de7?w=500",
    sizes: ["Standard"],
    colors: ["White", "Gray"],
    inStock: true,
    stock: 50,
    featured: true
  }
];

const seedAdditionalProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if additional categories already exist
    const existingProduct = await Product.findOne({ category: "home & living" });

    if (existingProduct) {
      console.log('ℹ️  Additional categories already exist. Skipping seeding.');
      await mongoose.connection.close();
      return;
    }

    // Insert additional products
    await Product.insertMany(additionalProducts);
    console.log(`✅ Successfully seeded ${additionalProducts.length} additional products with new categories!`);

    // Display categories
    const categories = await Product.distinct('category');
    console.log(`📁 Available categories: ${categories.join(', ')}`);

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding additional products:', error);
    process.exit(1);
  }
};

// Run the seeder if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAdditionalProducts();
}

export default seedAdditionalProducts;
