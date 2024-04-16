const postRouter = require("express").Router();
const { attachToken, attachUser } = require("../util/middleware");

const postController = require("../controllers/posts");

const use = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

postRouter.get("/", postController.getAllPosts);
postRouter.post(
  "/",
  use(attachToken),
  use(attachUser),
  use(postController.createPost)
);
postRouter.put(
  "/:id",
  use(attachToken),
  use(attachUser),
  use(postController.updatePost)
);

module.exports = postRouter;
