const { Scene, Markup } = require("./Scenes");

new (class TakeFood extends Scene {
  constructor() {
    super("TakeFood");
    super.struct = {
      on: [["text", this.onText]],
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    const lots = await ctx.base.get("product");
    console.log(lots)
    ctx.reply(
      'Вы зашли в раздел "Взять еду"',
      Markup.keyboard(["Назад"])
        .oneTime()
        .resize()
    );

    await ctx.reply("Новый лот");
  }
  async onText(ctx) {
    switch (ctx.message.text) {
      case "Назад":
        await ctx.scene.enter("Main");
        break;
      default:
        await ctx.reply("Wrong!");
        break;
    }
  }
})();
