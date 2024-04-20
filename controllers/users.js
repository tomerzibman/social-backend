const NotFoundError = require("../errors/NotFoundError");
const user = require("../models/user");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  const { search } = req.query;

  let query = {};

  if (search) {
    query = { username: { $regex: new RegExp(search, "i") } };
  }
  const users = await User.find(query);
  res.json(users);
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate({
      path: "posts",
      populate: {
        path: "user",
        select: "username name photo",
      },
      select: "title content",
    })
    .populate({
      path: "posts",
      populate: {
        path: "comments",
        populate: {
          path: "user",
          select: "username name photo",
        },
        select: "content",
      },
    });
  if (!user) {
    throw NotFoundError(`user with id = ${req.params.id} does not exist`);
  }
  return res.json(user);
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

module.exports = { getAllUsers, getUserById, createUser };
