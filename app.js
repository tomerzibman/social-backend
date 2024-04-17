const express = require("express");
const cors = require("cors");
require("express-async-errors");

const loginRouter = require("./routes/loginRouter");
const postRouter = require("./routes/postRouter");
const userRouter = require("./routes/userRouter");
const errorHandler = require("./util/errorHandler");
const commentRouter = require("./routes/commentRouter");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/login", loginRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);
app.use("/api/comments", commentRouter);

// app.use(function (err, req, res, next) {
//   console.log(err);
//   res.status(err.status || 500).json({ message: err.message });
// });

app.use(errorHandler);

module.exports = app;
