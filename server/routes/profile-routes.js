import express from "express";
import { getProfile } from "../controllers/profile-controller.js";
import {verifyAccessToken} from "../middleware/verifytoken.js";

const router = express.Router();

router.get("/", verifyAccessToken, getProfile);

export default router;