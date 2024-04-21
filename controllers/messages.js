const Message = require("../models/message");

const getMessagesForConversation = async (req, res, next) => {
  const messages = await Message.find({ conversation: req.params.id }).populate(
    "sender",
    { id: 1, username: 1 }
  );
  res.json(messages);
};

module.exports = { getMessagesForConversation };
