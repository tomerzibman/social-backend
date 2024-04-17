const postRouter = require("express").Router();
const { attachToken, attachUser } = require("../util/middleware");
const validateOn = require("../middleware/validate");
const postSchema = require("../validation-schemas/postSchema");

const postController = require("../controllers/posts");

postRouter.get("/", postController.getAllPosts);

postRouter.post(
  "/",
  attachToken,
  attachUser,
  validateOn(postSchema),
  postController.createPost
);

postRouter.put("/:id", attachToken, attachUser, postController.updatePost);

module.exports = postRouter;
