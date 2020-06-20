const { Scene, Markup } = require("./Scenes");

new (class GiveFood extends Scene {
  constructor() {
    super("GiveFood");
    super.struct = {
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    ctx.session.product = {
      _id: undefined, // ID продукта
      authId: null, // это ID пользователя, отправившего продукт
      name: null, // название продукта
      photos: [], // массив ссылок на фотографии
      category: null,
      burnTime: null,
      location: {},
      isReserved: false
    };
    await ctx.reply(
      'Тут можно добавить продукт🍏'
    );
    await ctx.scene.enter("NameQuery");
  }
})();

new (class NameQuery extends Scene {
  constructor() {
    super("NameQuery");
    super.struct = {
      on: [["text", this.onText]],
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    await ctx.reply(
      "Введите название продукта🍽",
      Markup.keyboard(["Назад↩"])
        .oneTime()
        .resize()
    );
  }
  async onText(ctx) {
    switch (ctx.message.text) {
      case "Назад↩":
        ctx.session.product.photos = null;
        await ctx.scene.enter("Main");
        break;
      default:
        ctx.session.product.name = ctx.message.text;
        await ctx.scene.enter("PhotoQuery");
        break;
    }
  }
})();

new (class PhotoQuery extends Scene {
  constructor() {
    super("PhotoQuery");
    super.struct = {
      on: [
        ["text", this.onText],
        ["photo", this.onPhoto]
      ],
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    await ctx.reply(
      "Загрузите от 1 до 10 фотографий продукта🖼",
      Markup.keyboard(["Загрузить💿", "Назад↩", "Пропустить🔜"])
        .oneTime()
        .resize()
        .extra()
    );
  }
  async onText(ctx) {
    const { product } = ctx.session;
    switch (ctx.message.text) {
      case "Назад↩":
        await ctx.scene.enter("NameQuery");
        product.photos = [];
        break;
      case "Загрузить💿":
        if (product.photos.length > 0 && product.photos.length < 10) {
          await ctx.scene.enter("CategoryQuery");
        } else {
          await ctx.reply("Загрузите корректное количество фотографий😖");
          //  Очищение локального кеша с фотками
          product.photos = [];
          await ctx.scene.reenter();
        }
        break;
      case "Пропустить🔜":
        await ctx.scene.enter("CategoryQuery")
    }
  }
  async onPhoto(ctx) {
    const { product } = ctx.session; //  Получение продуктов из кеша
    product.authId = ctx.from.id; //  Id пользователя
    product.photos = product.photos || [];
    const file_id = ctx.message.photo.pop().file_id;
    const link = await ctx.telegram.getFileLink(file_id);
    product.photos.push({ id: file_id, url: link }); //  Получение самой графонисторй фотографии
  }
})();

const keyboardKeys = [
  ["Мясо🍗", "Фрукты и ягоды🍏"],
  ["Овощи🍆", "Молочные продукты🥛"],
  ["Лекарства💊", "Сладкое🍬"],
  ["Крупы🍚", "Замороженное🧊"],
  ["Напитки🍹", "Детское👶🏻"],
  ["Выпечка🍞", "Другое🤷‍"],
  ["Назад↩"]
];

new (class CategoryQuery extends Scene {
  constructor() {
    super("CategoryQuery");
    super.struct = {
      on: [["text", this.onText]],
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    await ctx.reply(
        "Выберите категорию🍰",
        Markup.keyboard(keyboardKeys)
            .oneTime()
            .resize()
            .extra()
    );
  }
  async onText(ctx) {
    if ([].concat(...keyboardKeys.slice(0, -1)).includes(ctx.message.text)) {
      ctx.session.product.category = ctx.message.text;
      await ctx.scene.enter("TakeTimeQuery");
    } else if (ctx.message.text === "Назад↩")
      await ctx.scene.enter("PhotoQuery");
  }
})();

new (class TakeTimeQuery extends Scene {
  constructor() {
    super("TakeTimeQuery");
    super.struct = {
      on: [["text", this.onText]],
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    await ctx.reply("В течение скольки часов забрать еду?⏰", Markup.keyboard("Пропустить🔜"));
  }
  async onText(ctx) {
    if (Number(ctx.message.text) > 0) {
      let time = new Date();
      time.setHours(time.getHours() + ctx.message.text);
      ctx.session.product.burnTime = time;
      ctx.scene.enter("CommentaryQuery");
    } else if(ctx.message.text==="Пропустить🔜") {
      await ctx.reply("Выставлено стандартное время: 48 часов")
      await ctx.scene.enter("CommentaryQuery")
    } else {
      await ctx.reply("Формат неверен😞");
    }
  }
})();

new (class CommentaryQuery extends Scene {
  constructor() {
    super("CommentaryQuery");
    super.struct = {
      on: [["text", this.onText]],
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    await ctx.reply(
      "Введите комментарий📃",
      Markup.keyboard(["Пропустить🔜", "Назад↩"])
        .oneTime()
        .resize()
        .extra()
    );
  }
  async onText(ctx) {
    const { product } = ctx.session;
    switch (ctx.message.text) {
      case "Назад↩":
        product.commentary = null;
        await ctx.scene.enter("TakeTimeQuery");
        break;
      case "Пропустить🔜":
    //    TODO: ДОДЕЛАТЬ
    }
    if (ctx.message.text) {
      product.commentary = ctx.message.text;
      await ctx.scene.enter("locationQuery");
    }

  }
})();

new (class locationQuery extends Scene {
  constructor() {
    super("locationQuery");
    super.struct = {
      on: [
        ["text", this.onText],
        ["location", this.onLocation]
      ],
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    await ctx.reply(
      "Установите геометку🌍",
      Markup.keyboard(["Использовать стандартную🌐", "Назад↩"])
        .oneTime()
        .resize()
        .extra()
    );
  }
  async onLocation(ctx) {
    ctx.session.product.location = ctx.message.location;
    // TODO: Отправить ctx.session.product в БД
    console.log(ctx.session.product);
    await ctx.scene.enter("Main");
  }
  async onText(ctx) {
    switch (ctx.message.text) {
      case "Использовать стандартную🌐":
        ctx.session.product.location = ctx.base.get("config", {_id: ctx.from.id});
        const newProduct = await ctx.base.set("product", ctx.session.product);
        console.log(newProduct);
        global.Controller.emit("newProduct", newProduct);
        await ctx.scene.enter("Main");
        break;
      case "Назад↩":
        ctx.session.product.location = {};
        await ctx.scene.enter("CommentaryQuery");
        break;
    }
  }
})();
