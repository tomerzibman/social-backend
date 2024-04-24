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
const unreadCountRouter = require("./routes/unreadCountRouter");
const errorHandler = require("./util/errorHandler");
const Message = require("./models/message");
const UnreadCount = require("./models/unreadCount");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

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

  socket.on("joinReceiver", (receiverId) => {
    socket.join(receiverId);
    console.log(`user joing receiver ${receiverId}`);
  });

  socket.on("sendMessage", async (data) => {
    console.log("on sendMessage: ", data.content);
    const message = new Message({
      conversation: data.conversation,
      sender: data.sender,
      content: data.content,
    });

    const savedMessage = await message.save();
    const populatedMessage = await Message.findById(savedMessage._id).populate(
      "sender",
      {
        id: 1,
        username: 1,
      }
    );

    await UnreadCount.updateMany(
      { conversation: data.conversation },
      { $inc: { count: 1 } }
    );

    const updatedUnreadCount = await UnreadCount.findOne({
      conversation: data.conversation,
      participant: { $ne: data.sender },
    });

    io.to(data.conversation).emit("newMessage", populatedMessage);
    console.log("emit updateUnreadCount", updatedUnreadCount);
    io.to(updatedUnreadCount.participant.toString()).emit(
      "updateUnreadCount",
      updatedUnreadCount
    );

    // message
    //   .save()
    //   .then((savedMessage) => {
    //     return Message.findById(savedMessage._id).populate("sender", {
    //       id: 1,
    //       username: 1,
    //     });
    //   })
    //   .then((populatedMessage) => {
    //     console.log(
    //       "BEFORE EMIT newMessage -> unread count + 1 for all but sender"
    //     );
    //     console.log("emit newMessage: ", populatedMessage.content);
    //     io.to(data.conversation).emit("newMessage", populatedMessage);
    //   });
  });

  socket.on("markAsRead", async (data) => {
    const updatedUnreadCount = await UnreadCount.findOneAndUpdate(
      { conversation: data.conversation, participant: data.participant },
      { $set: { count: 0 } },
      { new: true }
    );
    //console.log(`Date: ${data.date}, convo: ${data.conversation}`);
    io.to(data.conversation).emit("updateUnreadCount", updatedUnreadCount);
  });

  socket.on("disconnect", () => {
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
app.use("/api/unreadcounts", unreadCountRouter);

app.use(errorHandler);

module.exports = server;
