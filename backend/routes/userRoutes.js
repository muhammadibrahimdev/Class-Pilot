import express from 'express'
import { addTeacher, getAllTeachers } from '../controllers/userController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/teacher', protect, authorize("schooladmin", "superadmin"), addTeacher);
router.get('/teachers', protect, authorize("schooladmin", "superadmin"), getAllTeachers);

export default router;