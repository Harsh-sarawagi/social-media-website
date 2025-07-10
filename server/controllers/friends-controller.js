import { User } from "../models/user.js";
import { createNotification } from "../utils/createnotification.js";

// ✅ Send Friend Request
export const sendRequest = async (req, res) => {
  try {
    const senderId = req.userID;
    const { receiverId } = req.body;

    if (senderId === receiverId)
      return res.status(400).json({ message: "You cannot send a request to yourself." });

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver) return res.status(404).json({ message: "User not found" });

    if (sender.friendlist.includes(receiverId))
      return res.status(400).json({ message: "You are already friends." });

    if (sender.sentRequests.includes(receiverId))
      return res.status(400).json({ message: "Request already sent." });

    if (sender.receivedRequests.includes(receiverId))
      return res.status(400).json({ message: "You have a pending request from this user." });

    await User.findByIdAndUpdate(senderId, { $addToSet: { sentRequests: receiverId } });
    await User.findByIdAndUpdate(receiverId, { $addToSet: { receivedRequests: senderId } });
    await createNotification({
      user: receiverId, // the one receiving the request
      from: senderId,   // logged-in user
      type: 'request_sent'
    });


    res.status(201).json({ message: "Friend request sent." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// ✅ Accept Friend Request
export const acceptRequest = async (req, res) => {
  try {
    const receiverId = req.userID;
    const { senderId } = req.body;

    const receiver = await User.findById(receiverId);
    if (!receiver.receivedRequests.includes(senderId))
      return res.status(400).json({ message: "No pending request from this user." });

    // Remove request
    await User.findByIdAndUpdate(receiverId, {
      $pull: { receivedRequests: senderId },
      $addToSet: { friendlist: senderId }
    });

    await User.findByIdAndUpdate(senderId, {
      $pull: { sentRequests: receiverId },
      $addToSet: { friendlist: receiverId }
    });
    await createNotification({
      user: senderId, // original requester
      from: receiverId,
      type: 'request_accepted'
    });

    res.status(200).json({ message: "Friend request accepted." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// ✅ Reject Friend Request
export const rejectRequest = async (req, res) => {
  try {
    const receiverId = req.userID;
    const { senderId } = req.body;

    await User.findByIdAndUpdate(receiverId, { $pull: { receivedRequests: senderId } });
    await User.findByIdAndUpdate(senderId, { $pull: { sentRequests: receiverId } });

    res.status(200).json({ message: "Friend request rejected." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// ✅ Cancel Sent Friend Request
export const cancelRequest = async (req, res) => {
  try {
    const senderId = req.userID;
    const { receiverId } = req.body;
    console.log(senderId,receiverId);
    await User.findByIdAndUpdate(senderId, { $pull: { sentRequests: receiverId } });
    await User.findByIdAndUpdate(receiverId, { $pull: { receivedRequests: senderId } });

    res.status(200).json({ message: "Friend request cancelled." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// ✅ Unfriend a user
export const unfriend = async (req, res) => {
  try {
    const userId = req.userID;
    const { friendId } = req.body;

    await User.findByIdAndUpdate(userId, { $pull: { friendlist: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friendlist: userId } });

    res.status(200).json({ message: "Unfriended successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
