const messageRouter = require("express").Router();

const messageController = require("../controllers/messages");

messageRouter.get("/:id", messageController.getMessagesForConversation);

module.exports = messageRouter;
