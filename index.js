const {
  Telegraf,
  Markup,
  Stage,
  session,
  ScenesController
} = require("./scenes");

const {token} = require("./config.json");
const bot = new Telegraf(token);

bot.use(
  session(),
  require("./wrappers"),
  global.ScenesController.stage.middleware(),
  Telegraf.log()
);

bot.start(ctx => ctx.scene.enter("Main"));

bot.launch().then(() => console.log("Listening..."));
