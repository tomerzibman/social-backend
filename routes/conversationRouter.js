const conversationRouter = require("express").Router();

const conversationController = require("../controllers/conversations");

conversationRouter.get("/:id", conversationController.getConversationsForUser);
conversationRouter.post("/", conversationController.createConversation);

module.exports = conversationRouter;
