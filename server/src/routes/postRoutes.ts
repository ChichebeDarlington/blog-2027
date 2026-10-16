import { Router } from 'express';
import { createPost, dashboardStats, deletePost, getPublicPost, listAdminPosts, listPublicPosts, updatePost } from '../controllers/postController';
import { protect } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.get('/', asyncHandler(listPublicPosts));
router.get('/admin/dashboard', protect, asyncHandler(dashboardStats));
router.get('/admin/all/list', protect, asyncHandler(listAdminPosts));
router.post('/admin', protect, asyncHandler(createPost));
router.patch('/admin/:id', protect, asyncHandler(updatePost));
router.delete('/admin/:id', protect, asyncHandler(deletePost));
router.get('/:slug', asyncHandler(getPublicPost));
export default router;
