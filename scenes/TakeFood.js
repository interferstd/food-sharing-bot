const { Scene, Markup } = require("./Scenes");

new (class TakeFood extends Scene {
  constructor() {
    super("TakeFood");
    super.struct = {
      on: [["text", this.onText]],
      enter: [[this.enter]]
    };
  }
  enter(ctx) {
    ctx.reply(
      'Вы зашли в раздел "Взять еду"',
      Markup.keyboard(["Назад"])
        .oneTime()
        .resize()
        .extra()
    );
  }
  onText(ctx) {
    switch (ctx.message.text) {
      case "Назад":
        ctx.scene.enter("Main");
        break;
      default:
        ctx.reply("Wrong!");
        break;
    }
  }
  onPhoto(ctx) {
    ctx.reply("Вау");
  }
  async zahod(ctx) {
    await ctx.reply(
      'Вы зашли в раздел "Взять еду"',
      Markup.keyboard(["Назад"])
        .oneTime()
        .resize()
        .extra()
    );
  }
})();
