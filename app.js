const express = require("express");
const cors = require("cors");

const loginRouter = require("./routes/loginRouter");
const postRouter = require("./routes/postRouter");
const userRouter = require("./routes/userRouter");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/login", loginRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);

app.use(function (err, req, res, next) {
  console.log(err);
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
