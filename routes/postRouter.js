const postRouter = require("express").Router();

const postController = require("../controllers/posts");

postRouter.get("/", postController.getAllPosts);
postRouter.post("/", postController.createPost);
postRouter.put("/:id", postController.updatePost);

module.exports = postRouter;
