import express from 'express';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { createClass, getAllClasses, getClassById } from '../controllers/classController.js';

const router = express.Router();

router.post('/class', protect, authorize('schooladmin'), createClass);
router.get('/classes', protect, authorize('schooladmin', 'superadmin', 'teacher'), getAllClasses);
router.get('/class/:id', protect, authorize('schooladmin', 'superadmin', 'teacher'), getClassById);

export default router;