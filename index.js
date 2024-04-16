const mongoose = require("mongoose");

const app = require("./app");
const config = require("./util/config");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((error) => console.log(error));
