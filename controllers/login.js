const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const config = require("../util/config");
const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");

const login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await User.findOne({ username: username });

  if (!user) {
    throw new NotFoundError(`user with username ${username} not found`);
  }

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!passwordCorrect) {
    throw new UnauthorizedError("username or password incorrect");
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
