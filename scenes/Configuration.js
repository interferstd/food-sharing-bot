const { Scene } = require("./Scenes");

new (class Configuration extends Scene {
  constructor() {
    super("Configuration");
    super.struct = {
      on: [
        ["text", this.onText],
        ["photo", this.onPhoto]
      ],
      start: [[this.main]],
      enter: [[this.zahod]]
    };
  }
  async main(ctx) {
    await ctx.reply("Main");
  }
  async onText(ctx) {
    await ctx.reply("Чё");
  }
  async onPhoto(ctx) {
    await ctx.reply("Вау");
  }
  async zahod(ctx) {
    await ctx.reply("123123123");
  }
})();
