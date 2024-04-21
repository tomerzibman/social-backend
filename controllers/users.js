const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../util/config");

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
      select: "id title content",
    })
    .populate({
      path: "posts",
      populate: {
        path: "comments",
        populate: {
          path: "user",
          select: "username name photo",
        },
        select: "content createdAt",
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

const updateUser = async (req, res) => {
  const decodedToken = jwt.verify(req.token, config.SECRET);
  if (!decodedToken.id || decodedToken.id != req.params.id) {
    throw UnauthorizedError();
  }

  const photoPath = !req.file || !req.file.filename ? null : req.file.filename;

  const user = await User.findById(req.params.id);

  user.username = req.body.username || user.username;
  user.name = req.body.name || user.name;
  user.photo =
    photoPath === null
      ? user.photo
      : `${req.protocol}://${req.get("host")}/images/${photoPath}`;

  await user.save();
  const userToReturn = await User.findById(req.params.id)
    .populate({
      path: "posts",
      populate: {
        path: "user",
        select: "username name photo",
      },
      select: "id title content",
    })
    .populate({
      path: "posts",
      populate: {
        path: "comments",
        populate: {
          path: "user",
          select: "username name photo",
        },
        select: "content createdAt",
      },
    });
  res.json(userToReturn);
};

module.exports = { getAllUsers, getUserById, createUser, updateUser };
