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
  main(ctx) {
    ctx.reply("Main");
  }
  onText(ctx) {
    ctx.reply("Чё");
  }
  onPhoto(ctx) {
    ctx.reply("Вау");
  }
  async zahod(ctx) {
    await ctx.reply("123123123");
  }
})();
