import { Router } from 'express';
import {
  listCartItems,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from '../controllers/cartController.js';
import { authMiddleware } from '../controllers/authController.js';

const router = Router();

router.get('/', authMiddleware, listCartItems);
router.post('/', authMiddleware, addCartItem);
router.put('/:id', authMiddleware, updateCartItemQuantity);
router.delete('/:id', authMiddleware, removeCartItem);
router.delete('/', authMiddleware, clearCart);

export default router;