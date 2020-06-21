const { Scene, Markup } = require("./Scenes");
const { relevance } = require("../relevant");

function generateMessage(obj) {
  return (
    `${obj.name ? obj.name + "\n" : ""}` +
    // todo: добавить расстояние до пользователя как часть объекта
    `${obj.distance ? obj.distance + " км до места\n" : ""}` +
    `${obj.city ? "🏢 Город: " + obj.city + "\n" : ""}` +
    `${
      obj.burnTime
        ? "⏰ Истекает через " + obj.burnTime.getHours() + " часов\n"
        : ""
    }` +
    `${obj.commentary ? "📄 " + obj.commentary + "\n" : ""}` +
    `${
      obj.category.length
        ? "🍰 Категории:\n" + obj.category.map(elm => elm + " ") + "\n\n"
        : ""
    }` +
    `${obj.profileLink ? `📞 Связь: ${obj.profileLink}` : "Контактов нет"}`
  );
}

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
    const trueLots = lots.filter(function (lot){
      global.bot.telegram.getChat(lot.authId).then(elm => (lot.profileLink = "@" + elm.username));
      return relevance(lot, user[0])
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
