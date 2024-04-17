const userRouter = require("express").Router();

const userController = require("../controllers/users");
const { upload } = require("../util/middleware");

userRouter.get("/", userController.getAllUsers);
userRouter.post("/", upload.single("photo"), userController.createUser);

module.exports = userRouter;
