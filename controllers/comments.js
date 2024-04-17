const Comment = require("../models/comment");
const Post = require("../models/post");

const addComment = async (req, res) => {
  const postId = req.body.postId;
  const userId = req.user.id;

  const comment = new Comment({
    content: req.body.content,
    user: userId,
    post: postId,
  });

  const savedComment = await comment.save();

  const post = await Post.findById(postId);
  post.comments.push(savedComment._id);
  await post.save();

  const populatedComment = await savedComment.populate("user", {
    username: 1,
    name: 1,
  });
  res.json(populatedComment);
};

module.exports = { addComment };
