const { Scene } = require("./Scenes");
const Markup = require("telegraf/markup");

new (class TakeFood extends Scene {
  constructor() {
    super("TakeFood");
    super.struct = {
      on: [
        ["text", this.onText],
      ],
      enter: [[this.enter]]
    };
  }
  enter(ctx) {
    ctx.reply(
        "Выберите интересующий товар",
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
    }
  }
})();
