const { Scene, Markup } = require("./Scenes");

new (class Start extends Scene {
  constructor() {
    super("Start");
    super.struct = {
      enter: [[this.enter]]
    };
  }
  enter(ctx) {
    ctx.reply("Начальная конфигурация пользователя");
    ctx.scene.enter("getStartUsername")
   }
})();


new (class getStartUsername extends Scene {
  constructor() {
    super("getStartUsername");
    super.struct = {
      on: [
        ["text", this.onText]
      ],
      enter: [[this.enter]]
    };
  }
  enter(ctx){
    ctx.reply("Введите ваше имя")
  }
  onText(ctx){
    // TODO запомнить имя
    console.log(ctx.message.text)
    ctx.scene.enter("getStartUserCity")
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
  enter(ctx){
    ctx.reply("Введите ваш город")
  }
  onText(ctx){
    // TODO запомнить город
    console.log(ctx.message.text)
    ctx.scene.enter("getStartUserLocation")
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
  enter(ctx){
    ctx.reply("Отправьте вашу геолокацию")
  }
  onLocation(ctx){
    // TODO запомнить геолокацию
    console.log(ctx.message.location)
    ctx.scene.enter("Main")

  }
})();


// new (class getStartUserLocation extends Scene {
//   constructor() {
//     super("getStartUserLocation");
//     super.struct = {
//       on: [
//         ["text", this.onText]
//       ],
//       enter: [[this.enter]]
//     };
//   }
//   enter(ctx){
//     ctx.reply("Отправьте вашу геолокацию")
//   }
//   onText(ctx){
//     // TODO запомнить геолокацию
//     console.log(ctx.message.text)
//     ctx.scene.enter("")
//   }
// })();
