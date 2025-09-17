import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true, index: true },
  imageUrl: { type: String, required: true },
  sizes: { type: [String], required: true },
  colors: { type: [String], required: true },
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false, index: true },
});

export default mongoose.model('Product', ProductSchema);