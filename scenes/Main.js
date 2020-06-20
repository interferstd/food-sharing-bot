const { Scene } = require("./Scenes");
const Markup = require("telegraf/markup");

new (class Main extends Scene {
  constructor() {
    super("Main");
    super.struct = {
      on: [["text", this.onText]],
      enter: [[this.enter]]
    };
  }

  async enter(ctx) {
    await ctx.reply(
      "Главное меню",
      Markup.keyboard(["Конфигурация⚙", "Отдать еду🍏", "Взять еду👋"])
        .oneTime()
        .resize()
        .extra()
    );
  }

  async onText(ctx) {
    switch (ctx.message.text) {
      case "Конфигурация⚙":
        await ctx.scene.enter("StartConfiguration");
        break;
      case "Отдать еду🍏":
        await ctx.scene.enter("GiveFood");
        break;
      case "Взять еду👋":
        await ctx.scene.enter("TakeFood");
        break;
    }
  }
})();
