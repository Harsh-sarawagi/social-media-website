// routes/notification.js
import express from 'express';
import {Notification} from '../models/notifications.js';
import { verifyAccessToken } from '../middleware/verifytoken.js'; // Your JWT or session auth middleware

const router = express.Router();

// Get notifications for logged-in user
router.get('/', verifyAccessToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.userID })
      .sort({ createdAt: -1 })
      .populate('from', 'name profilepicture userID')
      .populate('post', 'image')
      .limit(50);

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark all notifications as read
router.put('/read', verifyAccessToken, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.userID, isRead: false }, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
});

export default router;
