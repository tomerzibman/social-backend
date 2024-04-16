const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const config = require("../util/config");
const User = require("../models/user");

const login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await User.findOne({ username: username });

  if (!user) {
    return res
      .status(404)
      .json({ message: `user with username ${username} not found` });
  }

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!passwordCorrect) {
    return res.status(401).json({
      message: "username or password incorrect, unauthenticated",
    });
  }

  const token = jwt.sign(
    { username: user.username, id: user._id },
    config.SECRET,
    {
      expiresIn: 60 * 60,
    }
  );
  res.json({ token, username: user.username, name: user.name });
};

module.exports = { login };
