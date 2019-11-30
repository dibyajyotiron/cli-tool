let env = process.env.NODE_ENV;

switch (env) {
  case "production":
    module.exports = require("./prod");
    break;
  case "development":
    module.exports = require("./dev");
    break;
}
