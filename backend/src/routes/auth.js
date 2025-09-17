import { Router } from 'express';
// Import the new controller functions
import { register, login, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = Router();

// ... (existing register and login routes)
router.post('/register', register);
router.post('/login', login);

// Add these two new routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;