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
            takeUntil: null
        };
        await ctx.reply("Вы зашли в раздел \"Отдать еду\". Тут можно добавить продукт.");
        //await ctx.scene.enter("CategoryQuery")
        await ctx.scene.enter("NameQuery")
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
    onText(ctx) {
        const product = ctx.session.product; // products.takeUntil - поле, в которое записываем время
        switch (ctx.message.text) {
            //TODO: time!
            case ("До определённого часа"):

                break;
            case ("В определенный час"):

                break;
            case ("До определенного дня"):

                break;
            case ("В определенный день"):

                break;
        }
    }

    async enter(ctx) {
        await ctx.reply(
            "Как забрать?",
            Markup.keyboard(
                ["До определённого часа", "В определенный час",
                        "До определенного дня", "В определенный день"])
                .oneTime().resize().extra()
        );
    }
})();

new (class CommentaryQuery extends Scene {
    constructor() {
        super("CommentaryQuery");
        super.struct = {
            on: [
                ["text", this.onText],
            ],
            enter: [[this.enter]]
        };
    }
    async onText(ctx) {
        const product = ctx.session.product;
        if (ctx.message.text) {
            product.commentary = ctx.message.text;
            console.log(product);
            //TODO Отправить product в БД
            await ctx.reply(`Вы успешно добавили товар: ${product.name}!`);
            await ctx.scene.enter("Main");
        }else if (ctx.message.text == "Назад"){
            product.commentary = null;
            ctx.scene.enter("TakeTimeQuery");
        }
    }

    async enter(ctx) {
        await ctx.reply(
            "Введите комментарий",
            Markup.keyboard(
                ["Назад"])
                .oneTime().resize().extra()
        );
    }
})();