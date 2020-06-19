const {
  Telegraf,
  Markup,
  Stage,
  session,
  ScenesController
} = require("./scenes");

const { token } = require("./config.json");
const bot = new Telegraf(token);

bot.use(
  session(),
  require("./wrappers"),
  Telegraf.log(),
  global.ScenesController.stage.middleware()
);

bot.start(ctx => ctx.scene.enter("Start"));

bot.launch().then(() => console.log("Listening..."));
