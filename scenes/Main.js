const { Scene } = require("./Scenes");
const Markup = require('telegraf/markup')

new (class Main extends Scene {
    constructor() {
        super("Main");
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
        switch (ctx.message.text) {
            case ("Конфигурация"):
                ctx.scene.enter("Configuration")
                break;
            case ("Отдать еду"):
                ctx.scene.enter("GiveFood")
                break;
            case ("Взять еду"):
                ctx.scene.enter("TakeFood")
                break;
            default:
                ctx.reply("Wrong!");
        }
    }
    onPhoto(ctx) {
        ctx.reply("Вау");
    }
    async zahod(ctx) {
        await ctx.reply(
            "Добро пожаловать! Это сцена Main.",
            Markup.keyboard(["Конфигурация", "Отдать еду", "Взять еду"]).oneTime().resize().extra()
            );
    }

})();
