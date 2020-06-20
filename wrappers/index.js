const { mongo } = require("../config.json");
const user = require("./user").get();
const vk = require("./vk").get();
const base = require("./base").get(mongo);

module.exports = (ctx, next) => {
  var doNext = false;
  user.middleware()(ctx, () => {
    doNext = true;
  });
  if (doNext) {
    doNext = false;
    base.middleware()(ctx, () => {
      doNext = true;
    });
    vk.middleware()(ctx, () => {
      doNext = true;
    });
  }
  if (doNext) next();
};
