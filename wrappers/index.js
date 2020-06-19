const user = require("./user").get();
const base = require("./base").get("токен");

module.exports = (ctx, next) => {
  var doNext = false;
  user.middleware()(ctx, () => {
    doNext = true;
  });
  if (doNext) {
    doNext = false;
    user.middleware()(ctx, () => {
      doNext = true;
    });
  }
  if (doNext) next();
};
