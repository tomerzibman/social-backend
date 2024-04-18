const User = require("../models/user");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

const createUser = async (req, res) => {
  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const photoPath =
    !req.file || !req.file.filename ? "default.jpg" : req.file.filename;

  const user = new User({
    username: req.body.username,
    name: req.body.name,
    passwordHash: passwordHash,
    posts: [],
    photo: `${req.protocol}://${req.get("host")}/images/${photoPath}`,
  });

  const savedUser = await user.save();
  res.status(201).json(savedUser);
};

module.exports = { getAllUsers, createUser };
