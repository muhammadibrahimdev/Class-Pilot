import express from 'express'
import { addTeacher, deleteTeacher, editTeacher, getAllTeachers } from '../controllers/teacherController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/teacher', protect, authorize("schooladmin", "superadmin"), addTeacher);
router.get('/teachers', protect, authorize("schooladmin", "superadmin"), getAllTeachers);
router.delete('/teacher/:id', protect, authorize("schooladmin", "superadmin"), deleteTeacher);
router.put('/teacher/:id', protect, authorize("schooladmin", "superadmin"), editTeacher);

export default router;