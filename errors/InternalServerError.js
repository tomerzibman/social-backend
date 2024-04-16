class InternalServerError extends Error {
  constructor(message = "Internal Server Error") {
    super(message);
    this.status = 500;
  }
}

module.exports = InternalServerError;
