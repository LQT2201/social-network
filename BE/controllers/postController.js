// controllers/postController.js
const Post = require("../models/Post");

// Tạo bài viết mới
const createPost = async (req, res) => {
  const { content, image } = req.body;

  try {
    const newPost = new Post({
      user: req.user.id,
      content,
      image,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: "Error creating post" });
  }
};

// Lấy tất cả bài viết
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name avatar");
    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({ message: "Error fetching posts" });
  }
};

module.exports = { createPost, getPosts };
