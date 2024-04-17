const commentRouter = require("express").Router();

const commentController = require("../controllers/comments");
const { attachToken, attachUser } = require("../util/middleware");
const validateOn = require("../middleware/validate");
const commentSchema = require("../validation-schemas/commentSchema");

commentRouter.post(
  "/",
  attachToken,
  attachUser,
  validateOn(commentSchema),
  commentController.addComment
);

module.exports = commentRouter;
