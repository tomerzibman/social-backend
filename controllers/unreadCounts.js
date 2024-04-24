const UnreadCount = require("../models/unreadCount");

const getUnreadCounts = async (req, res) => {
  const userId = req.params.id;
  const unreadCounts = await UnreadCount.find({ participant: userId });
  res.json(unreadCounts);
};

module.exports = { getUnreadCounts };
