const ajv = require("./ajv");

const schema = {
  type: "object",
  properties: {
    username: { type: "string", nonWhiteSpace: true },
    password: { type: "string", nonWhiteSpace: true },
  },
  required: ["username", "password"],
};

module.exports = ajv.compile(schema);
