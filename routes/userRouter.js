const userRouter = require("express").Router();

const userController = require("../controllers/users");

userRouter.get("/", userController.getAllUsers);
userRouter.post("/", userController.createUser);

module.exports = userRouter;
