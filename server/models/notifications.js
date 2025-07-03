import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Who receives it

  type: {
    type: String,
    enum: ['like', 'comment', 'request_sent', 'request_accepted', 'request_rejected'],
    required: true,
  },

  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who triggered it (optional for post_created)

  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // If it's related to a post

  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
