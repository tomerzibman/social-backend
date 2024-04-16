const postRouter = require("express").Router();
const { attachToken, attachUser } = require("../util/middleware");

const postController = require("../controllers/posts");

postRouter.get("/", postController.getAllPosts);
postRouter.post("/", attachToken, attachUser, postController.createPost);
postRouter.put("/:id", attachToken, attachUser, postController.updatePost);

module.exports = postRouter;
