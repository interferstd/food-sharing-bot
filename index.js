const {
  Telegraf,
  Markup,
  Stage,
  session,
  ScenesController
} = require("./scenes");

const { telegram, vk_token } = require("./config.json");
global.bot = new Telegraf(telegram);
const vk = require("./vk.js").get(vk_token);

global.bot.use(
  session(),
  require("./wrappers"),
  // Telegraf.log(),
  global.Scenes.stage.middleware()
);
global.bot.start(ctx => ctx.scene.enter("Start"));

global.Controller.on("DataBaseConnected", async () => {
  await global.bot.launch();
  setInterval(() => {
    vk.getPosts("sharingfood", 10);
  }, 60000);
  console.log("Listening...");
});
