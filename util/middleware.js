const jwt = require("jsonwebtoken");
const config = require("./config");

const User = require("../models/user");

const attachToken = (req, res, next) => {
  const auth = req.get("authorization");
  if (auth && auth.startsWith("Bearer ")) {
    req.token = auth.replace("Bearer ", "");
  }
  next();
};

const attachUser = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, config.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ message: "invalid token" });
  }
  req.user = await User.findById(decodedToken.id);
  next();
};

module.exports = { attachToken, attachUser };
