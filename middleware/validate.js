const validateOn = (validate) => {
  return (req, res, next) => {
    const valid = validate(req.body);
    if (!valid) {
      const errors = validate.errors;
      console.log(errors);
      return res
        .status(400)
        .json({ error: errors, message: "Validation error eccrued" });
    }
    next();
  };
};

module.exports = validateOn;
