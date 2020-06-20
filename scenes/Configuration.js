const { Scene, Markup } = require("./Scenes");

const keyboardKeys = [
  ["Радиус", "Уведомления"],
  ["Имя", "Город"],
  ["Геолокация", "Предпочтения"],
  ["Сохранить", "Назад"]
];

new (class StartConfiguration extends Scene {
  constructor() {
    super("StartConfiguration");
    super.struct = {
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    const resp = await ctx.base.get("config", { _id: ctx.from.id });
    ctx.session.baseConfig = resp[0];
    console.log(resp);
    await ctx.scene.enter("Configuration");
  }
})();

new (class Configuration extends Scene {
  constructor() {
    super("Configuration");
    super.struct = {
      on: [["text", this.onText]],
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
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
      case "Сохранить":
        await ctx.base.update(
          "config",
          { _id: ctx.from.id },
          ctx.session.baseConfig
        );
        console.log(ctx.session.baseConfig);
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
    ctx.session.baseConfig.location = ctx.message.location;
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
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    ctx.session.baseConfig.name = ctx.from.first_name;
    ctx.reply("Имя обновлено");
    await ctx.scene.enter("Configuration");
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
    const prefs = ctx.session.baseConfig.preferences;
    const inp = ctx.message.text.slice(0, -2);
    if (inp in prefs) {
      prefs[inp] = !prefs[inp];
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
