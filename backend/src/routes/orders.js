import { Router } from 'express';
import { listOrders, getOrder, createOrder } from '../controllers/ordersController.js';
import { authMiddleware } from '../controllers/authController.js';

const router = Router();

router.get('/', authMiddleware, listOrders);
router.get('/:id', authMiddleware, getOrder);
router.post('/', authMiddleware, createOrder);

export default router;