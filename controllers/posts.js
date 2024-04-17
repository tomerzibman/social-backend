const NotFoundError = require("../errors/NotFoundError");
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
  const populatedPost = await savedPost.populate("user", {
    username: 1,
    name: 1,
  });
  req.user.posts.push(populatedPost._id);
  await req.user.save();
  res.status(201).json(populatedPost);
};

const updatePost = async (req, res) => {
  const postToUpdate = await Post.findById(req.params.id);

  if (!postToUpdate) {
    throw new NotFoundError(`Post with id = ${req.params.id} not found`);
  }

  postToUpdate.title = req.body.title;
  postToUpdate.content = req.body.content;
  postToUpdate.likes = req.body.likes;

  const updatedPost = await postToUpdate.save();
  const populatedPost = await updatedPost.populate("user", {
    username: 1,
    name: 1,
  });
  res.json(populatedPost);
};

module.exports = { getAllPosts, createPost, updatePost };
