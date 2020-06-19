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
      radius: null,
      alerts: true,
      name: null,
      city: null,
      location: null,
      //TODO: preferences
    }
    await ctx.reply(
      "Начальная конфигурация пользователя. Все настройки можно будет изменить в будущем"
    );
    //TODO: redirect на main
    await ctx.scene.enter("Main")
    //await ctx.scene.enter("getStartUserRadius")
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
    await ctx.reply("Введите радиус");
  }
  async onText(ctx) {
    if (/\d/.test(ctx.message.text) && +ctx.message.text >= 1){
      ctx.session.baseConfig.radius = ctx.message.text;
      await ctx.scene.enter("getStartUserCity");
    }

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

    console.log(ctx.session.baseConfig)

    //TODO: пофиксить
    ctx.base.sendBaseConfig(ctx.session.baseConfig.copy());
    await ctx.scene.enter("Main");
  }
})();
