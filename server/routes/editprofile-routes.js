import express from 'express'
import { verifyAccessToken } from '../middleware/verifytoken.js'
import { User } from '../models/user.js';

const router = express.Router();

router.patch("/edit", verifyAccessToken, async (req, res) => {
  try {
    const userId = req.userID;
    const { name, bio, profilepicture, profilepicturepublicid } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(bio && { bio }),
        ...(profilepicture !== undefined && { profilepicture }),
        ...(profilepicturepublicid !== undefined && { profilepicturepublicid: profilepicturepublicid }),
      },
      { new: true }
    ).select("name bio profilepicture profilepicturepublicid");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Edit Profile Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;