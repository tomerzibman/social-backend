const Conversation = require("../models/conversation");

const getConversationsForUser = async (req, res) => {
  console.log("getting convo");
  console.log("req.params.id: ", req.params.id);
  const conversations = await Conversation.find({
    participants: { $in: [req.params.id] },
  }).populate("participants", "username photo");
  res.json(conversations);
};

const createConversation = async (req, res) => {
  const conversation = new Conversation({
    participants: req.body.participants,
  });
  const savedConversation = await conversation.save();
  res.json(savedConversation);
};

module.exports = { getConversationsForUser, createConversation };
