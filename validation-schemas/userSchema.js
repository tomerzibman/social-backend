const ajv = require("./ajv");

const schema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      nonWhiteSpace: true,
      pattern: "^[a-zA-Z0-9]+$",
    },
    name: {
      type: "string",
      nonWhiteSpace: true,
      pattern: "^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$",
    },
    password: {
      type: "string",
      nonWhiteSpace: true,
      minLength: 5,
    },
    confirmPassword: {
      type: "string",
      const: {
        $data: "1/password",
      },
    },
  },
  required: ["username", "name", "password", "confirmPassword"],
};

module.exports = ajv.compile(schema);
