import { Router } from 'express';
import { createProject, deleteProject, getPublicProject, listAdminProjects, listPublicProjects, updateProject } from '../controllers/projectController';
import { protect } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.get('/', asyncHandler(listPublicProjects));
router.get('/admin/all/list', protect, asyncHandler(listAdminProjects));
router.post('/admin', protect, asyncHandler(createProject));
router.patch('/admin/:id', protect, asyncHandler(updateProject));
router.delete('/admin/:id', protect, asyncHandler(deleteProject));
router.get('/:slug', asyncHandler(getPublicProject));
export default router;
