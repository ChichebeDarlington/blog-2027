import { Router } from 'express';
import { login, logout, me } from '../controllers/authController';
import { protect } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.post('/login', asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.get('/me', protect, asyncHandler(me));
export default router;
