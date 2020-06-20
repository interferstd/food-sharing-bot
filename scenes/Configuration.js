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
    //TODO: Ниже объект-заглушка, чтобы сейчас все работало. По сути, она не нужна.

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
    // TODO: UPDATE USER object
    switch (ctx.message.text) {
      case "Назад":
        await ctx.scene.enter("Configuration");
        break;
      case "Включить":
        // TODO: set USER field "alerts" to true;
        ctx.session.baseConfig.alerts = true;
        await ctx.reply("Уведомления включены!");
        await ctx.scene.enter("Configuration");
        break;
      case "Выключить":
        // TODO: set USER field "alerts" to false;
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
          // TODO: UPDATE USER object
          ctx.session.baseConfig.radius = ctx.message.text; // TODO: set USER field "radius";
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
    // TODO: UPDATE USER object
    ctx.session.baseConfig.location = ctx.message.location; // TODO: set USER field "location";
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
      // TODO: UPDATE USER object
      ctx.session.baseConfig.city = ctx.message.text; // TODO: set USER field "city";
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
      // TODO: UPDATE USER object
      ctx.session.baseConfig.name = ctx.message.text; // TODO: set USER field "name";
      await ctx.reply("Вы успешно обновили имя!");
      await ctx.scene.enter("Configuration");
    }
  }
})();

new (class ConfPreference extends Scene {
  constructor() {
    super("ConfPreference");
    super.struct = {
      on: [["text", this.onText]],
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    await ctx.reply(
      "Выбор предпочтений",
      Markup.keyboard(
        [].concat(
          [["Сохранить"]],
          Object.entries(ctx.session.baseConfig.preferences).map(it => [
            it[0] + (it[1] ? " ✅" : " ❌")
          ])
        )
      )
        .oneTime()
        .resize()
        .extra()
    );
  }
  async onText(ctx) {
    // TODO: UPDATE USER object
    const prefs = ctx.session.baseConfig.preferences;
    const inp = ctx.message.text.slice(0, -2);
    if (inp in prefs) {
      prefs[inp] = !prefs[inp]; // TODO: set USER field "preferences";
      await ctx.reply(
        inp + " set to " + prefs[inp],
        Markup.keyboard(
          [].concat(
            [["Сохранить"]],
            Object.entries(prefs).map(it => [it[0] + (it[1] ? " ✅" : " ❌")])
          )
        )
          .oneTime()
          .resize()
          .extra()
      );
    } else if (ctx.message.text === "Сохранить") {
      await ctx.scene.enter("Configuration");
      await ctx.reply("Вы успешно обновили предпочтения!");
    }
  }
})();
