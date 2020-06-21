const {
  Telegraf,
  Markup,
  Stage,
  session,
  ScenesController
} = require("./scenes");

const { telegram, vk_token, foodshare, geocode } = require("./config.json");

global.geocode = require("node-geocoder")(geocode);
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
    foodshare.map(name => vk.getPosts(name, 10));
  }, 6000); //TODO: 60000
  console.log("Listening...");
});
