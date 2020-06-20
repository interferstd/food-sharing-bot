const {
  Telegraf,
  Markup,
  Stage,
  session,
  ScenesController
} = require("./scenes");

const { telegram, geocode } = require("./config.json");

const nodeFetch = require("node-fetch");
// geocode.fetch = (url, options) => {
//   return nodeFetch(url, {
//     ...options,
//     headers: {
//       "user-agent": "My application <email@domain.com>",
//       "X-Specific-Header": "Specific value"
//     }
//   });
// };
global.google = require("node-geocoder")(geocode);

const bot = new Telegraf(telegram);

bot.use(
  session(),
  require("./wrappers"),
  // Telegraf.log(),
  global.Scenes.stage.middleware()
);

bot.start(ctx => ctx.scene.enter("Start"));

global.Controller.on("DataBaseConnected", async () => {
  await bot.launch();
  console.log("Listening...");
});
