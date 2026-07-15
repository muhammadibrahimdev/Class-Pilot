import express from 'express';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { addStudent, deleteStudent, getallStudents, getStudentById, updateStudent } from '../controllers/studentController.js';
const router = express.Router();

router.post('/', protect, authorize('schooladmin', 'teacher'), addStudent);
router.get('/', protect, authorize('schooladmin', 'teacher'), getallStudents);
router.get('/:id', protect, authorize('schooladmin', 'teacher'), getStudentById);
router.put('/:id', protect, authorize('schooladmin', 'teacher'), updateStudent);
router.delete('/:id', protect, authorize('schooladmin', 'teacher'), deleteStudent);

export default router;