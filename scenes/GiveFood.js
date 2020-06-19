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
            burnTine: null
        };
        await ctx.reply("Вы зашли в раздел \"Отдать еду\". Тут можно добавить продукт.");
        // TODO поставить нормальный переход
        await ctx.scene.enter("TakeTimeQuery")
        // await ctx.scene.enter("NameQuery")
    }
})();

new (class NameQuery extends Scene {
    constructor() {
        super("NameQuery");
        super.struct = {
            on: [
                ["text", this.onText],
            ],
            enter: [[this.enter]]
        };
    }
    enter(ctx) {
        ctx.reply(
            "Введите название продукта",
            Markup.keyboard(["Назад"]).oneTime().resize().extra()
        );
    }
    onText(ctx) {
        switch (ctx.message.text) {
            case ("Назад"):
                ctx.session.product.photos = null;
                ctx.scene.enter("GiveFood");
                break;
            default:
                ctx.session.product.name = ctx.message.text;
                ctx.scene.enter("PhotoQuery");
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
                ["photo", this.onPhoto],
            ],
            enter: [[this.enter]]
        };
    }
    enter(ctx) {
        ctx.reply(
            "Загрузите от 1 до 10 фотографий продукта",
            Markup.keyboard(["Загрузить", "Назад"]).oneTime().resize().extra()
        );
    }
    onText(ctx) {
        const product = ctx.session.product;
        switch (ctx.message.text) {
            case ("Назад"):
                ctx.scene.enter("NameQuery");
                product.photos = [];
                break;
            case ("Загрузить"):
                if (product.photos.length > 0 && product.photos.length < 10) {
                    ctx.scene.enter("CategoryQuery");
                } else {
                    ctx.reply("Загрузите корректное количество фотографий");
                    //  Очищение локального кеша с фотками
                    product.photos = [];
                    ctx.scene.reenter();
                }
                break;
        }
    }
    onPhoto(ctx) {
        const product = ctx.session.product; //  Получение продуктов из кеша
        product.authId = ctx.from.id; //  Id пользователя
        product.photos = product.photos || [];
        product.photos.push(ctx.message.photo.pop().file_id); //  Получение самой графонисторй фотографии
    }
})();

const keyboardKeys = [
    ["Мясо", "Фрукты и ягоды", "Овощи"],
    ["Молочные продукты", "Лекарства", "Сладкое"] ,
    ["Крупы", "Замороженное", "Напитки"],
    ["Детское", "Выпечка", "Другое"],
    ["Назад"]
];

new (class CategoryQuery extends Scene {
    constructor() {
        super("CategoryQuery");
        super.struct = {
            on: [
                ["text", this.onText],
            ],
            enter: [[this.enter]]
        };
    }
    onText(ctx) {
        const product = ctx.session.product;
        if ([].concat(...keyboardKeys.slice(0, -1)).includes(ctx.message.text)){
            product.category = ctx.message.text;
            ctx.scene.enter("TakeTimeQuery")
        }else if (ctx.message.text == "Назад") ctx.scene.enter("PhotoQuery");
    }

    async enter(ctx) {
        await ctx.reply(
            "Выберите категорию",
            Markup.keyboard(keyboardKeys).oneTime().resize().extra()
        );
    }
})();

new (class TakeTimeQuery extends Scene {
    constructor() {
        super("TakeTimeQuery");
        super.struct = {
            on: [
                ["text", this.onText],
            ],
            enter: [[this.enter]]
        };
    }
    enter(ctx) {
        ctx.reply("В течение скольки часов забрать еду?");
    }
    onText(ctx) {
        if(Number(ctx.message.text) > 0 ) {
            const product = ctx.session.product;
            let time = new Date();
            time.setHours(time.getHours() + ctx.message.text);
            product.time = time;
            /////////////////
            ctx.reply(time)
            console.log(product)
            /////////////////
            ctx.reenter();
        } else {
            ctx.reply("Формат неверен");
        }
    }
})();