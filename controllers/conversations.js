const Conversation = require("../models/conversation");

const getConversationsForUser = async (req, res) => {
  console.log("getting convo");
  console.log("req.params.id: ", req.params.id);
  const conversations = await Conversation.find({
    participants: { $in: [req.params.id] },
  }).populate("participants", "id username photo");
  res.json(conversations);
};

const createConversation = async (req, res) => {
  const { participants } = req.body;
  const existingConversation = await Conversation.findOne({
    participants: { $all: participants },
  });

  if (existingConversation) {
    return res.status(400).json({ error: "Conversation already exists" });
  }

  const conversation = new Conversation({
    participants: participants,
  });
  const savedConversation = await conversation.save();
  const populatedConversation = await Conversation.findById(
    savedConversation._id
  ).populate("participants", "id username photo");
  res.json(populatedConversation);
};

module.exports = { getConversationsForUser, createConversation };
