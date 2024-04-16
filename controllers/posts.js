const Post = require("../models/post");

const getAllPosts = async (req, res) => {
  const posts = await Post.find({}).populate("user", { username: 1, name: 1 });
  res.json(posts);
};

const createPost = async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    likes: req.body.likes,
    user: req.user.id,
  });

  const savedPost = await post.save();
  res.status(201).json(savedPost);
};

const updatePost = async (req, res) => {
  const postToUpdate = await Post.findById(req.params.id);

  if (!postToUpdate) {
    res
      .status(404)
      .json({ message: `Post with id = ${req.params.id} not found` });
  }

  postToUpdate.title = req.body.title;
  postToUpdate.content = req.body.content;
  postToUpdate.likes = req.body.likes;

  const updatedPost = await postToUpdate.save();

  res.json(updatedPost);
};

module.exports = { getAllPosts, createPost, updatePost };
