const unreadCountRouter = require("express").Router();
const unreadCountController = require("../controllers/unreadCounts");

unreadCountRouter.get("/:id", unreadCountController.getUnreadCounts);

module.exports = unreadCountRouter;
