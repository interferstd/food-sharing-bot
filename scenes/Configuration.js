const { Scene, Markup } = require("./Scenes");

const keyboardKeys = [
  ["Радиус", "Уведомления"],
  ["Имя", "Город"],
  ["Геолокация", "Предпочтения"],
  ["Назад"]
];

new (class Configuration extends Scene {
  constructor() {
    super("Configuration");
    super.struct = {
      on: [["text", this.onText]],
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    //TODO: эту хуйню куда-то в другое место надо сунуть
    ctx.session.baseConfig = {
      radius: null,
      alerts: null,
      name: null,
      city: null,
      location: null
      //TODO: preferences
    };
    await ctx.reply(
      "Настройки",
      Markup.keyboard(keyboardKeys)
        .oneTime()
        .resize()
        .extra()
    );
  }
  async onText(ctx) {
    switch (ctx.message.text) {
      case "Назад":
        await ctx.scene.enter("Main");
        break;
      case "Радиус":
        await ctx.scene.enter("ConfRadius");
        break;
      case "Уведомления":
        await ctx.scene.enter("ConfAlerts");
        break;
      case "Геолокация":
        await ctx.scene.enter("ConfLocation");
        break;
      case "Предпочтения":
        await ctx.scene.enter("ConfPreference");
        break;
      case "Имя":
        await ctx.scene.enter("ConfName");
        break;
      case "Город":
        await ctx.scene.enter("ConfCity");
        break;
    }
  }
})();

new (class ConfAlerts extends Scene {
  constructor() {
    super("ConfAlerts");
    super.struct = {
      on: [["text", this.onText]],
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    await ctx.reply(
      "Включить уведомления?",
      Markup.keyboard([["Включить", "Выключить"], ["Назад"]])
        .oneTime()
        .resize()
        .extra()
    );
  }
  async onText(ctx) {
    switch (ctx.message.text) {
      case "Назад":
        await ctx.scene.enter("Configuration");
        break;
      case "Включить":
        ctx.session.baseConfig.alerts = true;
        await ctx.reply("Уведомления включены!");
        await ctx.scene.enter("Configuration");
        break;
      case "Выключить":
        ctx.session.baseConfig.alerts = false;
        await ctx.reply("Уведомления выключены!");
        await ctx.scene.enter("Configuration");
        break;
    }
  }
})();

new (class ConfRadius extends Scene {
  constructor() {
    super("ConfRadius");
    super.struct = {
      on: [["text", this.onText]],
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    await ctx.reply(
      "Введите радиус в км",
      Markup.keyboard(["Назад"])
        .oneTime()
        .resize()
        .extra()
    );
  }
  async onText(ctx) {
    switch (ctx.message.text) {
      case "Назад":
        await ctx.scene.enter("Configuration");
        break;
      default:
        if (/\d/.test(ctx.message.text) && +ctx.message.text >= 1) {
          ctx.session.baseConfig.radius = ctx.message.text;
          await ctx.reply("Вы успешно обновили радиус!");
          await ctx.scene.enter("Configuration");
        } else {
          ctx.reply("Попробуйте еще раз.");
          ctx.scene.reenter();
        }

        break;
    }
  }
})();

new (class ConfLocation extends Scene {
  constructor() {
    super("ConfLocation");
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
      "Отправьте вашу геолокацию",
      Markup.keyboard(["Назад"])
        .oneTime()
        .resize()
        .extra()
    );
  }
  async onLocation(ctx) {
    ctx.session.baseConfig.name = ctx.from.first_name;
    ctx.session.baseConfig.location = ctx.message.location;
    await ctx.base.sendConfig(ctx.session.baseConfig);
    await ctx.reply("Вы успешно одновили геолокацию!");
    await ctx.scene.enter("Configuration");
  }
  async onText(ctx) {
    console.log(ctx.session.baseConfig);
    if (ctx.message.text === "Назад") ctx.scene.enter("Configuration");
  }
})();

new (class ConfCity extends Scene {
  constructor() {
    super("ConfCity");
    super.struct = {
      on: [["text", this.onText]],
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    await ctx.reply(
      "Введите ваш город",
      Markup.keyboard(["Назад"])
        .oneTime()
        .resize()
        .extra()
    );
  }
  async onText(ctx) {
    if (ctx.message.text === "Назад") {
      ctx.scene.enter("Configuration");
    } else {
      ctx.session.baseConfig.city = ctx.message.text;
      await ctx.reply("Вы успешно обновили город!");
      await ctx.scene.enter("Configuration");
    }
  }
})();

new (class ConfName extends Scene {
  constructor() {
    super("ConfName");
    super.struct = {
      on: [["text", this.onText]],
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    await ctx.reply(
      "Введите Ваше имя",
      Markup.keyboard(["Назад"])
        .oneTime()
        .resize()
        .extra()
    );
  }
  async onText(ctx) {
    if (ctx.message.text === "Назад") {
      ctx.scene.enter("Configuration");
    } else {
      ctx.session.baseConfig.name = ctx.message.text;
      await ctx.reply("Вы успешно обновили имя!");
      await ctx.scene.enter("Configuration");
    }
  }
})();

//TODO: сделать сцену изменения предпочтений
