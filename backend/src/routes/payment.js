import express from 'express';
import {
  createCheckoutSession,
  createQuickCheckoutSession,
  handleWebhook,
  getOrderBySession
} from '../controllers/paymentController.js';
import { authMiddleware } from '../controllers/authController.js';

const router = express.Router();

// Create checkout session for cart items (requires auth)
router.post('/create-checkout-session', authMiddleware, createCheckoutSession);

// Create quick checkout session for single product - Buy Now (requires auth)
router.post('/create-quick-checkout-session', authMiddleware, createQuickCheckoutSession);

// Stripe webhook endpoint (no auth - uses signature verification)
// Note: This route needs raw body parser, configured in server.js
router.post('/webhook', handleWebhook);

// Get order by session ID for success page (requires auth)
router.get('/order-by-session', authMiddleware, getOrderBySession);

export default router;
