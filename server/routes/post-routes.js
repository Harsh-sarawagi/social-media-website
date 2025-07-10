import express from 'express';
import { verifyAccessToken } from '../middleware/verifytoken.js';
import { Post } from '../models/post.js';
import { User } from '../models/user.js';
import { createNotification } from '../utils/createnotification.js';

const router = express.Router();

// Create a new post
router.post('/create', verifyAccessToken, async (req, res) => {
  try {
    const { caption, image } = req.body;
    const userId = req.userID;

    const newPost = await Post.create({
      author: userId,
      caption,
      image,
    });
    await User.findByIdAndUpdate(userId,{$push:{posts:newPost._id}})
    res.status(201).json({ message: 'Post created', post: newPost });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

// Middleware to check friend access
const canAccessPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('author', 'userID profilepicture _id')
      .populate('comments.user', 'userID profilepicture _id');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const user = await User.findById(req.userID);

    const isFriend = user.friendlist.some(
      (friendId) => friendId.toString() === post.author._id.toString()
    );

    const isAuthor = post.author._id.toString() === req.userID;

    if (!isAuthor && !isFriend) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const hasLiked = post.likes.includes(req.userID);

    req.post = post;
    req.hasliked = hasLiked;
    next();
  } catch (err) {
    console.error("Error in canAccessPost:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// Get a post (self or friend)
router.get('/:postId', verifyAccessToken, canAccessPost, async (req, res) => {
  res.status(200).json({post:req.post,hasliked:req.hasliked});
});

// Comment on a post (self or friend)
router.post('/:postId/comment', verifyAccessToken, canAccessPost, async (req, res) => {
  try {
    const { text } = req.body;
    const comment = {
      user: req.userID,
      text,
    };
    req.post.comments.push(comment);
    await req.post.save();
    await createNotification({
      user: req.post.author,
      from: req.userID,
      type: 'comment',
      post: req.post._id
    });
    res.status(201).json({ message: 'Comment added', comments: req.post.comments });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
});

// Delete a post (owner only)
router.delete('/:postId', verifyAccessToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.userID) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await User.findByIdAndUpdate(req.userID,{$pull:{posts:post._id}})
    await Post.findByIdAndDelete(post._id);
    
    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
});

// Like/Unlike a post (self or friend)
router.post('/:postId/like', verifyAccessToken, canAccessPost, async (req, res) => {
  try {
    const userId = req.userID;
    const index = req.post.likes.indexOf(userId);
    const {postId} = req.params;

    if (index === -1) {
      req.post.likes.push(userId);
      await req.post.save();
      await User.findByIdAndUpdate(userId,{$push:{likedposts:postId}})
      await createNotification({
        user: req.post.author,
        from: userId,
        type: 'like',
        post: postId
      });

      return res.status(200).json({ message: 'Post liked' });
    } else {
      req.post.likes.splice(index, 1);
      await req.post.save();
      await User.findByIdAndUpdate(userId,{$pull:{likedposts:postId}})
      return res.status(200).json({ message: 'Post unliked' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error liking/unliking post', error: error.message });
  }
});

// Remove comment (author of comment or post owner)
router.delete('/:postId/comment/:commentId', verifyAccessToken, canAccessPost, async (req, res) => {
  try {
    const { post } = req;
    const { commentId } = req.params;
    const userId = req.userID;

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user._id.toString() !== userId && post.author._id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    post.comments.pull(commentId);
    await post.save();

    res.status(200).json({ message: 'Comment removed' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error removing comment', error: error.message });
  }
});

export default router;
