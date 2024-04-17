const loginRouter = require("express").Router();

const loginController = require("../controllers/login");
const validateOn = require("../middleware/validate");
const loginSchema = require("../validation-schemas/loginSchema");

loginRouter.post("/", validateOn(loginSchema), loginController.login);

module.exports = loginRouter;
