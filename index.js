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
  // Telegraf.log(),
  global.Scenes.stage.middleware()
);
bot.start(ctx => ctx.scene.enter("Start"));

global.Scenes.Controller = {
  on: [
    ["Error", console.log],
    [
      "DataBaseConnected",
      function() {
        bot.launch().then(() => console.log("Listening..."));
      }
    ]
  ]
};
