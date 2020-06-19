class User {
  constructor(token) {
    this.mongo = require("mongoouse");
  }
  static get(token) {
    return new Base(token);
  }
  middleware() {
    return (ctx, next) => {
      ctx.base = this;
      next();
    };
  }
}
