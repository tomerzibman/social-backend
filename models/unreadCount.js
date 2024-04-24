const mongoose = require("mongoose");

const unreadCountSchema = mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

unreadCountSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("UnreadCount", unreadCountSchema);
