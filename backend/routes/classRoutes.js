import express from 'express';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { addSubjectToClass, createClass, getAllClasses, getClassById, removeSubjectFromClass, updateClass } from '../controllers/classController.js';

const router = express.Router();

router.post('/', protect, authorize('schooladmin'), createClass);
router.get('/', protect, authorize('schooladmin', 'superadmin', 'teacher'), getAllClasses);
router.get('/:id', protect, authorize('schooladmin', 'superadmin', 'teacher'), getClassById);
router.put('/:id', protect, authorize('schooladmin'), updateClass);
router.put('/:id/subjects', protect, authorize("schooladmin"), addSubjectToClass);
router.delete('/:id/subjects/:subjectId', protect, authorize('schooladmin'), removeSubjectFromClass);

export default router;