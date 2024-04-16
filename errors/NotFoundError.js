class NotFoundError extends Error {
  constructor(message = "Not Found", id = null) {
    super(message);
    this.status = 404;
    if (id) {
      this.message = `${message} with id = ${id} not found`;
    }
  }
}

module.exports = NotFoundError;
