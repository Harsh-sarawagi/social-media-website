import express from "express";
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken,
  checkAuth,
  resendVerificationCode,
} from "../controllers/auth-controllers.js";
import { verifyAccessToken } from "../middleware/verifytoken.js";

const router = express.Router();

// Register new user
router.post("/register", register);

// Login existing user
router.post("/login", login);

// Logout user (clears cookies or token)
router.post("/logout", logout);

// Email verification
router.post("/verify-email", verifyEmail);

// Forgot password: send reset link
router.post("/forgot-password", forgotPassword);

// Reset password using token
router.post("/reset-password/:token", resetPassword);

// Refresh access token using refresh token
router.get("/refresh", refreshToken);

// Check if user is authenticated (protected route)
router.get("/check-auth", verifyAccessToken, checkAuth);

router.post("/resendverificationcode", resendVerificationCode)

export default router;
