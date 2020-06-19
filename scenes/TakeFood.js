const { Scene } = require("./Scenes");
const Markup = require('telegraf/markup')

new (class TakeFood extends Scene {
    constructor() {
        super("TakeFood");
        super.struct = {
            on: [
                ["text", this.onText],
            ],
            enter: [[this.zahod]]
        };
    }

    onText(ctx) {
        switch (ctx.message.text) {
            case ("Назад"):
                ctx.scene.enter("Main");
                break;
            default:
                ctx.reply("Wrong!");
                break;
        }
    }
    zahod(ctx) {
        ctx.reply(
            "Вы зашли в раздел \"Взять еду\"",
            Markup.keyboard(["Назад"]).oneTime().resize().extra()
        );
    }
})();
