const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
require("express-async-errors");

const config = require("./util/config");
const loginRouter = require("./routes/loginRouter");
const postRouter = require("./routes/postRouter");
const userRouter = require("./routes/userRouter");
const commentRouter = require("./routes/commentRouter");
const conversationRouter = require("./routes/conversationRouter");
const messageRouter = require("./routes/messageRouter");
const errorHandler = require("./util/errorHandler");
const Message = require("./models/message");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => console.log(error));

app.use(cors());

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joinConversation", (conversation) => {
    socket.join(conversation);
    console.log(`user joing conversation ${conversation}`);
  });

  socket.on("sendMessage", (data) => {
    const message = new Message({
      conversation: data.conversation,
      sender: data.sender,
      content: data.content,
    });

    message
      .save()
      .then((savedMessage) => {
        return Message.findById(savedMessage._id).populate("sender", {
          id: 1,
          username: 1,
        });
      })
      .then((populatedMessage) => {
        io.to(data.conversation).emit("newMessage", populatedMessage);
      });
  });

  socket.on("disconnet", () => {
    console.log("a user disconnected");
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/login", loginRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);
app.use("/api/comments", commentRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);

app.use(errorHandler);

module.exports = server;
