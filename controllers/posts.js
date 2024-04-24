const NotFoundError = require("../errors/NotFoundError");
const Post = require("../models/post");

const getAllPosts = async (req, res) => {
  const posts = await Post.find({})
    .populate("user", { id: 1, username: 1, name: 1, photo: 1 })
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "id username photo",
      },
      select: "content createdAt",
    });
  res.json(posts);
};

const createPost = async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    likes: [],
    user: req.user.id,
    comments: [],
  });

  const savedPost = await post.save();
  const populatedPost = await savedPost.populate("user", {
    id: 1,
    username: 1,
    name: 1,
    photo: 1,
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
  const populatedPost = await Post.findById(updatedPost._id)
    .populate("user", { id: 1, username: 1, name: 1, photo: 1 })
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "id username photo",
      },
      select: "content createdAt",
    });

  res.json(populatedPost);
};

const likePost = async (req, res) => {
  const postId = req.params.id;

  const postToLike = await Post.findById(postId);
  if (!postToLike) {
    throw new NotFoundError("Post not found");
  } else if (postToLike.likes.includes(req.user._id)) {
    return res.status(400).json({ message: "Post already liked" });
  }

  postToLike.likes.push(req.user._id);
  const likedPost = await postToLike.save();
  const populatedPost = await Post.findById(likedPost._id)
    .populate("user", { id: 1, username: 1, name: 1, photo: 1 })
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "id username photo",
      },
      select: "content createdAt",
    });

  res.json(populatedPost);
};

const unlikePost = async (req, res) => {
  const postId = req.params.id;

  const postToUnlike = await Post.findById(postId);
  if (!postToUnlike) {
    throw new NotFoundError("Post not found");
  } else if (!postToUnlike.likes.includes(req.user._id)) {
    return res.status(400).json({ message: "Post was never liked" });
  }

  postToUnlike.likes = postToUnlike.likes.filter(
    (uId) => !uId.equals(req.user._id)
  );
  const unlikedPost = await postToUnlike.save();
  const populatedPost = await Post.findById(unlikedPost._id)
    .populate("user", { id: 1, username: 1, name: 1, photo: 1 })
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "id username photo",
      },
      select: "content createdAt",
    });

  res.json(populatedPost);
};

module.exports = { getAllPosts, createPost, updatePost, likePost, unlikePost };
