const { Scene } = require("./Scenes");

new (class Start extends Scene {
  constructor() {
    super("Start");
    super.struct = {
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    ctx.session.baseConfig = {
      name: null,
      city: null,
      location: null
    };
    await ctx.reply(
      "Начальная конфигурация пользователя. Все настройки можно будет изменить в будущем"
    );
    await ctx.scene.enter("getStartUserCity");
  }
})();

new (class getStartUserCity extends Scene {
  constructor() {
    super("getStartUserCity");
    super.struct = {
      on: [["text", this.onText]],
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    await ctx.reply("Введите ваш город");
  }
  async onText(ctx) {
    ctx.session.baseConfig.city = ctx.message.text;
    await ctx.scene.enter("getStartUserLocation");
  }
})();

new (class getStartUserLocation extends Scene {
  constructor() {
    super("getStartUserLocation");
    super.struct = {
      on: [["location", this.onLocation]],
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    await ctx.reply("Отправьте вашу геолокацию");
  }
  async onLocation(ctx) {
    ctx.session.baseConfig.name = ctx.from.first_name;
    ctx.session.baseConfig.location = ctx.message.location;

    ctx.base.sendConfig(ctx.session.baseConfig);
    await ctx.scene.enter("Main");
  }
})();
