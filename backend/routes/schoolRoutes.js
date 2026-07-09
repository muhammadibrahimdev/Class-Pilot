import express from 'express';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { approveSchool, getAllSchools, getPendingSchools, getSchoolById, getSchoolStats, rejectSchool } from '../controllers/schoolController.js';

const router = express.Router();

router.use(protect, authorize("superadmin"));

router.get('/stats', getSchoolStats);
router.get('/pending', getPendingSchools);
router.get("/", getAllSchools);
router.get("/:id", getSchoolById);
router.patch("/:id/approve", approveSchool);
router.delete("/:id/reject", rejectSchool);

export default router;