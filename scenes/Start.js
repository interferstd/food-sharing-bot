const { Scene } = require("./Scenes");

new (class Start extends Scene {
  constructor() {
    super("Start");
    super.struct = {
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    await ctx.reply("Начальная конфигурация пользователя. Все настройки можно будет изменить в будущем");
    // Для быстрого роутинга
    await ctx.scene.enter("GiveFood");
    // ctx.scene.enter("getStartUserCity")
   }
})();


new (class getStartUserCity extends Scene {
  constructor() {
    super("getStartUserCity");
    super.struct = {
      on: [
        ["text", this.onText]
      ],
      enter: [[this.enter]]
    };
  }
  async enter(ctx){
    await ctx.reply("Введите ваш город")
  }
  async onText(ctx){
    // TODO запомнить город
    console.log(ctx.message.text)
    await ctx.scene.enter("getStartUserLocation")
  }
})();


new (class getStartUserLocation extends Scene {
  constructor() {
    super("getStartUserLocation");
    super.struct = {
      on: [
        ["location", this.onLocation]
      ],
      enter: [[this.enter]]
    };
  }
  async enter(ctx){
    await ctx.reply("Отправьте вашу геолокацию")
  }
  async onLocation(ctx){
    // TODO запомнить геолокацию
    console.log(ctx.message.location)
    await ctx.scene.enter("Main")

  }
})();

