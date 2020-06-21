const { Scene, Markup } = require("./Scenes");
const { relevance, generateMessage } = require("../relevant");

new (class TakeFood extends Scene {
  constructor() {
    super("TakeFood");
    super.struct = {
      on: [["text", this.onText]],
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    ctx.reply(
      'Вы зашли в раздел "Взять еду"',
      Markup.keyboard(["Назад"])
        .oneTime()
        .resize()
        .extra()
    );
    const user = await ctx.base.get("config", { _id: ctx.from.id });
    const lots = await ctx.base.get("product");
    const trueLots = lots.filter(function(lot) {
      global.bot.telegram
        .getChat(lot.authId)
        .then(elm => (lot.profileLink = "@" + elm.username));
      return relevance(lot, user[0]);
    });
    for (var lot of trueLots) {
      await global.bot.telegram.sendMediaGroup(
        ctx.from.id,
        lot.photos.map(function(item, index) {
          return { type: "photo", media: item.id };
        })
      );
      await ctx.reply(generateMessage(lot));
    }
  }
  async onText(ctx) {
    switch (ctx.message.text) {
      case "Назад":
        await ctx.scene.enter("Main");
        break;
    }
  }
})();
