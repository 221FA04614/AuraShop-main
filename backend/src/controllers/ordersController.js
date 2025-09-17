import Order from '../models/Order.js';
import User from '../models/User.js';
import Cart from '../models/Cart.js';

// Corresponds to your 'list' query
export const listOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: 'Must be logged in' });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// Corresponds to your 'get' query
export const getOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: 'Must be logged in' });
    }

    const { id } = req.params;
    const order = await Order.findOne({ _id: id, userId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

// Corresponds to your 'create' mutation
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: 'Must be logged in' });
    }

    const { items, totalAmount, shippingAddress } = req.body;

    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      status: 'pending',
      shippingAddress,
    });
    const savedOrder = await newOrder.save();

    await Cart.deleteMany({ userId });

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};