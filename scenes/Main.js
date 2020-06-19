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

  enter(ctx) {
    ctx.reply(
      "Добро пожаловать! Это сцена Main.",
      Markup.keyboard(["Конфигурация", "Отдать еду", "Взять еду"])
        .oneTime()
        .resize()
        .extra()
    );
  }

  onText(ctx) {
    switch (ctx.message.text) {
      case "Конфигурация":
        ctx.scene.enter("Configuration");
        break;
      case "Отдать еду":
        ctx.scene.enter("GiveFood");
        break;
      case "Взять еду":
        ctx.scene.enter("TakeFood");
        break;
    }
  }
})();
