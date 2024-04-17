const express = require("express");
const cors = require("cors");
const path = require("path");
require("express-async-errors");

const loginRouter = require("./routes/loginRouter");
const postRouter = require("./routes/postRouter");
const userRouter = require("./routes/userRouter");
const errorHandler = require("./util/errorHandler");
const commentRouter = require("./routes/commentRouter");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(cors());

app.use("/api/login", loginRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);
app.use("/api/comments", commentRouter);

app.use(errorHandler);

module.exports = app;
