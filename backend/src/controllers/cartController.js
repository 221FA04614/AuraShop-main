import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Corresponds to your 'list' query
export const listCartItems = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: 'Must be logged in' });
    }

    const cartItems = await Cart.find({ userId }).populate('productId');

    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart items', error });
  }
};

// Corresponds to your 'add' mutation
export const addCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: 'Must be logged in' });
    }

    const { productId, quantity, size, color } = req.body;

    const existingItem = await Cart.findOne({
      userId,
      productId,
      size,
      color,
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      res.status(200).json(existingItem);
    } else {
      const newItem = new Cart({
        userId,
        productId,
        quantity,
        size,
        color,
      });
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to cart', error });
  }
};

// Corresponds to your 'updateQuantity' mutation
export const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: 'Must be logged in' });
    }

    const { id } = req.params;
    const { quantity } = req.body;

    const item = await Cart.findOne({ _id: id, userId });
    if (!item) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (quantity <= 0) {
      await item.deleteOne();
      return res.status(200).json({ message: 'Item removed from cart' });
    } else {
      item.quantity = quantity;
      await item.save();
      res.status(200).json(item);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item quantity', error });
  }
};

// Corresponds to your 'remove' mutation
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: 'Must be logged in' });
    }

    const { id } = req.params;
    const item = await Cart.findOne({ _id: id, userId });

    if (!item) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await item.deleteOne();
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from cart', error });
  }
};

// Corresponds to your 'clear' mutation
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: 'Must be logged in' });
    }

    await Cart.deleteMany({ userId });

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error });
  }
};