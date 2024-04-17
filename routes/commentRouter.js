const commentRouter = require("express").Router();

const commentController = require("../controllers/comments");
const { attachToken, attachUser } = require("../util/middleware");

commentRouter.post("/", attachToken, attachUser, commentController.addComment);

module.exports = commentRouter;
