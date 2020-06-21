const { Scene, Markup } = require("./Scenes");
const keyboardKeys = [
  ["Мясо🍗", "Фрукты и ягоды🍏"],
  ["Овощи🍆", "Молочные продукты🥛"],
  ["Лекарства💊", "Сладкое🍬"],
  ["Крупы🍚", "Замороженное🧊"],
  ["Напитки🍹", "Детское👶🏻"],
  ["Выпечка🍞", "Другое🤷‍"],
  ["Назад↩", "Отправить✉"]
];

new (class GiveFood extends Scene {
  constructor() {
    super("GiveFood");
    super.struct = {
      on: [["text", this.onText]],
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    ctx.session.product = {
      _id: undefined, // ID продукта
      authId: ctx.from.id,
      name: null, // название продукта
      photos: [], // массив ссылок на фотографии
      category: [],
      burnTime: null,
      location: {},
      isReserved: false,
      city: null
    };
    await ctx.reply(
      'Тут можно добавить продукт🍏', Markup.keyboard("Назад↩")
    );
    await ctx.scene.enter("NameQuery");
  }
  onText(ctx){
    if(ctx.message.text==="Назад"){
      ctx.scene.enter("Main")
    }
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
      Markup.keyboard(["Пропустить🔜", "Назад↩"])
        .oneTime()
        .resize()
        .extra()
    );
  }
  async onText(ctx) {
    switch (ctx.message.text) {
      case "Назад↩":
        ctx.session.product.photos = null;
        await ctx.scene.enter("Main");
        break;
      case "Пропустить🔜":
        ctx.scene.enter("PhotoQuery")
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
      Markup.keyboard(["Загрузить💿", "Пропустить🔜", "Назад↩"])
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
        "Выберите категории🍰\n\nПосле выбора нажмите кнопку \"отправить\"",
        Markup.keyboard(keyboardKeys)
            .resize()
            .extra()
    );
  }
  async onText(ctx) {
    if ([].concat(...keyboardKeys.slice(0, -1)).includes(ctx.message.text)) {
      if(ctx.session.product.category.includes(ctx.message.text)){
        ctx.session.product.category = ctx.session.product.category.filter(elm=>elm!==ctx.message.text);
        ctx.reply("Катаегория удалена")
        console.log(ctx.session.product.category)
      } else {
        ctx.session.product.category.push(ctx.message.text);
        ctx.reply("Категория добавлена")
        console.log(ctx.session.product.category)
      }
    } else if (ctx.message.text === "Назад↩") {
      ctx.session.product.category = [];
      await ctx.scene.enter("PhotoQuery");
    } else if(ctx.message.text==="Отправить✉"){
      await ctx.scene.enter("TakeTimeQuery");
    }
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
    await ctx.reply(
        "В течение скольки часов забрать еду?⏰",
        Markup.keyboard(["Пропустить🔜", "Назад↩"])
        .oneTime()
        .resize()
        .extra()
    );
  }
  async onText(ctx) {
    let time = new Date();
    if (Number(ctx.message.text) > 0) {
      time.setHours(time.getHours() + ctx.message.text);
      ctx.session.product.burnTime = time;
      ctx.scene.enter("CommentaryQuery");
    } else if(ctx.message.text==="Пропустить🔜") {
      time.setHours(time.getHours() + 48);
      await ctx.reply("Выставлено стандартное время: 48 часов")
      await ctx.scene.enter("CommentaryQuery")
    } else if (ctx.message.text==="Назад↩"){
      ctx.session.product.burnTime = null;
      await ctx.scene.enter("CategoryQuery")
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
        await ctx.scene.enter("TakeTimeQuery")
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
    await ctx.scene.enter("Main");
  }
  async onText(ctx) {
    switch (ctx.message.text) {
      case "Использовать стандартную🌐":
        const user = await ctx.base.get("config", {_id: ctx.from.id});
        ctx.session.product.location = user[0].location;
        ctx.session.product.city = user[0].city;
        const newProduct = await ctx.base.set("product", ctx.session.product);
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
