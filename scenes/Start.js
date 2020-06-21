const { Scene, Markup, Extra } = require("./Scenes");

new (class Start extends Scene {
  constructor() {
    super("Start");
    super.struct = {
      enter: [[this.enter]]
    };
  }

  async enter(ctx) {
    if ((await ctx.base.get("config", { _id: ctx.from.id })).length !== 0) {
      await ctx.scene.enter("Main");
      return;
    }
    ctx.session.baseConfig = {
      _id: null, // user.id
      radius: null,
      alerts: true,
      name: null,
      city: null,
      location: null,
      preferences: {
        "Мясо🍗": true,
        "Фрукты и ягоды🍏": true,
        "Овощи🍆": true,
        "Молочные продукты": true,
        "Лекарства💊": true,
        "Сладкое🍬": true,
        "Крупы🍚": true,
        "Замороженное🧊": true,
        "Напитки🍹": true,
        "Детское👶🏻": true,
        "Выпечка🍞": true,
        "Другое🤷": true
      }
    };
    await ctx.reply(
      "🛠Начальная конфигурация пользователя🛠\nВсе настройки можно будет изменить в будущем"
    );
    await ctx.scene.enter("getStartUserRadius");
  }
})();

new (class getStartUserRadius extends Scene {
  constructor() {
    super("getStartUserRadius");
    super.struct = {
      on: [["text", this.onText]],
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    await ctx.reply("Введите радиус в километрах📏");
  }
  async onText(ctx) {
    if (Number(ctx.message.text) > 0 && ctx.message.text < 100) {
      ctx.session.baseConfig.radius = ctx.message.text;
      await ctx.scene.enter("getStartUserCity");
    } else {
      ctx.reply("Радиус должен быть больше 0 и меньше 100❗");
    }
  }
})();

//TODO: в будущем убрать город, так как можно его получить через Api карт
new (class getStartUserCity extends Scene {
  constructor() {
    super("getStartUserCity");
    super.struct = {
      on: [["text", this.onText]],
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    await ctx.reply("Введите ваш город🏙");
  }
  async onText(ctx) {
    const addr = await global.geocode.geocode(ctx.message.text);
    ctx.session.baseConfig.city = addr[0].state;
    ctx.session.baseConfig.location = {
      latitude: addr[0].latitude,
      longitude: addr[0].longitude
    };
    await ctx.scene.enter("getStartUserLocation");
  }
})();

new (class getStartUserLocation extends Scene {
  constructor() {
    super("getStartUserLocation");
    super.struct = {
      on: [
        ["location", this.onLocation],
        ["text", this.onText]
      ],
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    await ctx.reply(
      "Отправьте вашу геолокацию🌍",
      Extra.markup(markup => {
        return markup
          .oneTime()
          .resize()
          .keyboard([
            markup.locationRequestButton("Отправить✉"),
            "Пропустить🔜"
          ]);
      })
    );
  }
  async onText(ctx) {
    if (ctx.message.text === "Пропустить🔜")
      await ctx.scene.enter("getStartUserName");
  }
  async onLocation(ctx) {
    ctx.session.baseConfig.location = ctx.message.location;
    await ctx.scene.enter("getStartUserName");
  }
})();

new (class getStartUserName extends Scene {
  constructor() {
    super("getStartUserName");
    super.struct = {
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    ctx.session.baseConfig.name = ctx.from.first_name;
    ctx.session.baseConfig._id = ctx.from.id;
    console.log(ctx.session.baseConfig);
    await ctx.base.remove("config", { _id: ctx.from.id });
    await ctx.base.set("config", ctx.session.baseConfig);
    await ctx.scene.enter("Main");
  }
})();
