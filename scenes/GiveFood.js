const { Scene } = require("./Scenes");
const Markup = require('telegraf/markup')

new (class GiveFood extends Scene {
    constructor() {
        super("GiveFood");
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
            case ("Назад"):
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
            "Вы зашли в раздел \"Отдать еду\"",
            Markup.keyboard(["Назад"]).oneTime().resize().extra()
            );
    }
})();
