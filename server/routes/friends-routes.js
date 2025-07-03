import express from "express";
import {verifyAccessToken} from "../middleware/verifytoken.js";
import { acceptRequest, cancelRequest, rejectRequest, sendRequest, unfriend } from "../controllers/friends-controller.js";

const router = express.Router();

// Send friend request
router.post("/send", verifyAccessToken, sendRequest);

// Accept request
router.post("/accept", verifyAccessToken, acceptRequest);

// Reject request
router.post("/reject", verifyAccessToken, rejectRequest);

// Delete (cancel) request
router.post("/delete", verifyAccessToken, cancelRequest);

// Unfriend a user
router.post("/unfriend", verifyAccessToken, unfriend);

export default router;
