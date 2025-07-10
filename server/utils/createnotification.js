import {Notification} from '../models/notifications.js';

export const createNotification = async ({ user, from, type, post = null }) => {
  try {
    await Notification.create({ user, from, type, post });
  } catch (err) {
    console.error("Notification creation failed:", err);
  }
};