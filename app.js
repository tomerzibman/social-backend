const express = require("express");
const cors = require("cors");
require("express-async-errors");

const postRouter = require("./routes/postRouter");
const userRouter = require("./routes/userRouter");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);

module.exports = app;
