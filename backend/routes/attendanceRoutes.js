import { authorize, protect } from "../middleware/authMiddleware";
import express from express();
import { deleteAttendance, getAttendanceReport, getClassAttendance, getStudentAttendance, markAttendance, updateAttendance } from "../controllers/attendanceController";

const router = express.Router();
router.post('/mark', protect, authorize('teacher', 'schooladmin'), markAttendance);
router.get('/:id', protect, authorize('teacher', 'schooladmin'), updateAttendance);
router.get('/class', protect('schooladmin', 'teacher'), getClassAttendance);
router.get('/student/:id'. protect, authorize('teacher', 'schooladmin', 'student', 'parent'), getStudentAttendance);
router.get('/report', protect, authorize('schooladmin', 'teacher'), getAttendanceReport);
router.delete('/:id', protect, authorize('schooladmin', 'teacher'), deleteAttendance);

export default router;