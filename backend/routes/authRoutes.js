import express from 'express';
import { getMe, login, logout, refreshToken, register } from "../controllers/authController.js";
import validate from "../middleware/validate.js";
import { loginValidator, registerValidator } from "../validators/authValidator.js";
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/refresh-token", refreshToken);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;