const userRouter = require("express").Router();

const userController = require("../controllers/users");
const { upload } = require("../util/middleware");
const validateOn = require("../middleware/validate");
const userSchema = require("../validation-schemas/userSchema");

userRouter.get("/", userController.getAllUsers);

userRouter.post(
  "/",
  upload.single("photo"),
  validateOn(userSchema),
  userController.createUser
);

module.exports = userRouter;
