const ajv = require("./ajv");

const schema = {
  type: "object",
  properties: {
    postId: { type: "string", nonWhiteSpace: true },
    content: { type: "string", nonWhiteSpace: true },
  },
  required: ["title", "content"],
};

module.exports = ajv.compile(schema);
