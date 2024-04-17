const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

ajv.addKeyword("nonWhiteSpace", {
  type: "string",
  validate: (schema, data) => {
    return data.trim().length > 0;
  },
  errorMessage: "Cannot be empty",
});

module.exports = ajv;
