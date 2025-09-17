import { Router } from 'express';
import {
  listProducts,
  getProduct,
  getCategories,
  createProduct,
} from '../controllers/productsController.js';

const router = Router();

router.get('/', listProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);
router.post('/', createProduct);

export default router;