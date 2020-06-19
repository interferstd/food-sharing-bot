const {
  Telegraf,
  Markup,
  Stage,
  session,
  ScenesController
} = require("./scenes");

const bot = new Telegraf("");

bot.use(
  session(),
  require("./wrappers"),
  global.ScenesController.stage.middleware(),
  Telegraf.log()
);

bot.start(ctx => ctx.scene.enter("Configuration"));

bot.launch().then(() => console.log("Listening..."));
