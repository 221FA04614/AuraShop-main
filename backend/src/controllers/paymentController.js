import Stripe from 'stripe';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Create checkout session for cart items
export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress } = req.body;

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone ||
        !shippingAddress.street || !shippingAddress.city || !shippingAddress.state ||
        !shippingAddress.zipCode || !shippingAddress.country) {
      return res.status(400).json({ message: 'Invalid or missing shipping address' });
    }

    // Fetch user's cart items with populated product details
    const cartItems = await Cart.find({ userId }).populate('productId');

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Check for deleted or out-of-stock products
    for (const item of cartItems) {
      if (!item.productId) {
        return res.status(400).json({ message: 'One or more products are no longer available' });
      }
      if (item.productId.stock < item.quantity) {
        return res.status(400).json({
          message: `${item.productId.name} is out of stock or has insufficient quantity`
        });
      }
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (item.productId.price * item.quantity);
    }, 0);

    // Create line items for Stripe
    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.productId.name,
          description: `Size: ${item.size}, Color: ${item.color}`,
          images: item.productId.imageUrl ? [item.productId.imageUrl] : [],
        },
        unit_amount: Math.round(item.productId.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/payment-cancel`,
      customer_email: req.user.email,
      metadata: {
        userId: userId.toString(),
        shippingAddress: JSON.stringify(shippingAddress),
        type: 'cart-checkout'
      },
    });

    res.status(200).json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    if (error.type === 'StripeError') {
      return res.status(500).json({ message: 'Payment service unavailable, please try again' });
    }
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
};

// Create quick checkout session for single product (Buy Now)
export const createQuickCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity, size, color, shippingAddress } = req.body;

    // Validate input
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    if (!quantity || quantity < 1 || quantity > 99) {
      return res.status(400).json({ message: 'Invalid quantity (must be between 1 and 99)' });
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone ||
        !shippingAddress.street || !shippingAddress.city || !shippingAddress.state ||
        !shippingAddress.zipCode || !shippingAddress.country) {
      return res.status(400).json({ message: 'Invalid or missing shipping address' });
    }

    // Fetch product from database
    const Product = (await import('../models/Product.js')).default;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Product is out of stock' });
    }

    // Calculate total
    const totalAmount = product.price * quantity;

    // Create line item for Stripe
    const lineItems = [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          description: size && color ? `Size: ${size}, Color: ${color}` : product.description,
          images: product.imageUrl ? [product.imageUrl] : [],
        },
        unit_amount: Math.round(product.price * 100), // Convert to cents
      },
      quantity: quantity,
    }];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/payment-cancel`,
      customer_email: req.user.email,
      metadata: {
        userId: userId.toString(),
        productId: productId.toString(),
        productName: product.name,
        quantity: quantity.toString(),
        size: size || '',
        color: color || '',
        shippingAddress: JSON.stringify(shippingAddress),
        type: 'quick-checkout'
      },
    });

    res.status(200).json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Error creating quick checkout session:', error);
    if (error.type === 'StripeError') {
      return res.status(500).json({ message: 'Payment service unavailable, please try again' });
    }
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
};

// Stripe webhook handler
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      // Check if order already exists (idempotency)
      const existingOrder = await Order.findOne({ stripeSessionId: session.id });
      if (existingOrder) {
        console.log('Order already exists for session:', session.id);
        return res.status(200).json({ received: true });
      }

      const { userId, shippingAddress, type } = session.metadata;
      const parsedShippingAddress = JSON.parse(shippingAddress);
      const totalAmount = session.amount_total / 100; // Convert from cents to dollars

      if (type === 'quick-checkout') {
        // Handle quick checkout (single product)
        const { productId, productName, quantity, size, color } = session.metadata;

        const orderData = {
          userId,
          items: [{
            productId,
            productName,
            quantity: parseInt(quantity),
            price: totalAmount / parseInt(quantity),
            size: size || 'N/A',
            color: color || 'N/A'
          }],
          totalAmount,
          shippingAddress: parsedShippingAddress,
          paymentStatus: 'paid',
          stripeSessionId: session.id,
        };

        await Order.create(orderData);
        console.log('Quick checkout order created:', orderData);

      } else {
        // Handle regular cart checkout
        const cartItems = await Cart.find({ userId }).populate('productId');

        if (!cartItems || cartItems.length === 0) {
          console.error('Cart is empty for user:', userId);
          return res.status(500).json({ message: 'Cart is empty' });
        }

        const orderItems = cartItems.map(item => ({
          productId: item.productId._id,
          productName: item.productId.name,
          quantity: item.quantity,
          price: item.productId.price,
          size: item.size,
          color: item.color
        }));

        const orderData = {
          userId,
          items: orderItems,
          totalAmount,
          shippingAddress: parsedShippingAddress,
          paymentStatus: 'paid',
          stripeSessionId: session.id,
        };

        await Order.create(orderData);
        console.log('Cart checkout order created:', orderData);

        // Clear user's cart after successful order
        await Cart.deleteMany({ userId });
        console.log('Cart cleared for user:', userId);
      }

    } catch (error) {
      console.error('Error processing webhook:', error);
      return res.status(500).json({ message: 'Failed to process payment' });
    }
  }

  res.status(200).json({ received: true });
};

// Get order by session ID (for success page)
export const getOrderBySession = async (req, res) => {
  try {
    const { session_id } = req.query;
    const userId = req.user.id;

    if (!session_id) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const order = await Order.findOne({
      stripeSessionId: session_id,
      userId
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order details' });
  }
};
