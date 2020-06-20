const {
  Telegraf,
  Markup,
  Stage,
  session,
  ScenesController
} = require("./scenes");

const { telegram } = require("./config.json");
global.bot = new Telegraf(telegram);

global.bot.use(
  session(),
  require("./wrappers"),
  // Telegraf.log(),
  global.Scenes.stage.middleware()
);

global.bot.start(ctx => ctx.scene.enter("Start"));

global.Controller.on("DataBaseConnected", async () => {
  await global.bot.launch();
  console.log("Listening...");
});
