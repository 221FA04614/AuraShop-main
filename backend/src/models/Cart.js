import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String, required: true },
  color: { type: String, required: true },
});

CartSchema.index({ userId: 1, productId: 1, size: 1, color: 1 }, { unique: true });

export default mongoose.model('Cart', CartSchema);