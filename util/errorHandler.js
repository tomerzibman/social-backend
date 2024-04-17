const mongoose = require("mongoose");

const errorHandler = function (err, req, res, next) {
  if (err.status && err.type && err.message) {
    return res
      .status(err.status)
      .json({ error: err.type, message: err.message });
  }

  let status = err.status || 500;
  let errType = err.type || "Internal Server Error";
  let errMsg = err.message || "An unexpected error occured";

  if (err.name === "JsonWebTokenError") {
    status = 401;
    errType = "Unauthorized";
    errMsg = err.message || "Invalid token";
  } else if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    errType = "Validation Error";
    const field = Object.keys(err.errors)[0];
    errMsg = `${field}: ${err.errors[field].message}`;
  } else if (err.name === "BcryptError") {
    status = 500;
    errType = "Internal Server Error";
    errMsg = "Bcrypt error occured";
  }

  return res.status(status).json({ error: errType, message: errMsg });
};

module.exports = errorHandler;
