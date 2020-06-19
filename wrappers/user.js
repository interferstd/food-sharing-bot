class User {
  constructor() {
    this.main = async () => {};
  }
  static get() {
    return new User();
  }
  middleware() {
    return (ctx, next) => {
      ctx.user = this;
      next();
    };
  }
  async goMain(ctx) {
    await ctx.scene.leave();
    await this.main(ctx);
  }
}
