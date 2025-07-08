// controllers/profileController.js
import { User } from "../models/user.js";

export const getProfile = async (req, res) => {
  const loggedInUserId = req.userID;
  const { userID } = req.query;

  try {
    const user = await User.findOne({ userID })
  .populate("friendlist", "name profilepicture userID")
  .populate("posts", "image")
  .populate("likedposts", "image.url _id")
  .populate("receivedRequests", "userID profilepicture name")
  .populate("sentRequests", "userID profilepicture name");

if (!user) return res.status(404).json({ error: "User not found" });

const isSelf = user._id.toString() === loggedInUserId;
const isFriend = user.friendlist.some(
  (friend) => friend._id.toString() === loggedInUserId
);
const isRequested = user.receivedRequests.some(
  (request) => request._id.toString() === loggedInUserId
);
const isPending = user.sentRequests.some(
  (request) => request._id.toString() === loggedInUserId
);

let role = "stranger";

if (isSelf) {
  role = "self";
} else if (isFriend) {
  role = "friend";
} else if (isRequested) {
  role = "requested"; // loggedInUser has sent a request → awaiting approval
} else if (isPending) {
  role = "pending"; // loggedInUser received a request → needs to accept/reject
}
    const baseProfile = {
      _id: user._id,
      name: user.name,
      profilepicture: user.profilepicture,
      bio: user.bio,
      userID: user.userID
    };

    if (role === "self") {
      const { password, ...userData } = user.toObject();
      return res.status(200).json({ user: userData, role });
    }

    if (role === "friend") {
      return res.status(200).json({
        user: {
          ...baseProfile,
          email: user.email,
          friendlist: user.friendlist,
          posts: user.posts,
        },
        role,
      });
    }

    // Stranger, requested or pending
    return res.status(200).json({
      user: {
        ...baseProfile,
        friendCount: user.friendlist.length,
        postCount: user.posts.length,
      },
      role,
    });

  } catch (err) {
    console.error("Profile fetch error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

