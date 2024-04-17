const validateOn = (validate) => {
  return (req, res, next) => {
    console.log("IN VALIDATION");
    const valid = validate(req.body);
    if (!valid) {
      console.log("FOUND ERRORS");
      const errors = validate.errors;
      console.log(errors);
      return res.status(400).json(errors);
    }
    next();
  };
};

module.exports = validateOn;
