import express from "express";
import {verifyAccessToken} from "../middleware/verifytoken.js";
import { User } from "../models/user.js";


const router = express.Router();

router.get("/search", verifyAccessToken, async (req, res) => {
  try {
    const query = req.query.name;
    if (!query) {
      return res.status(400).json({ error: "Query name is required" });
    }

    const regex = new RegExp(query, "i"); // case-insensitive search
    const users = await User.find({ name: regex }).select("name userID profilePic _id");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}); // e.g. /search?name=harsh

export default router;