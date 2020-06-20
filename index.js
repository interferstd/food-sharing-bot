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

// TODO: если пользователь уже регался, то пусть в мэйн пиздошит, если нет, то в старт
bot.start(ctx => ctx.scene.enter("Start"));

global.Controller.struct = {
  on: [
    // TODO: vk навешивать сюда
    // TODO: размещение постова(можно вынести в любой другой оно дополняется ?также можно сделать удаление)
    ["Error", console.log],
    [
      "DataBaseConnected",
      async function() {
        await bot.launch();
        console.log("Listening...");
      }
    ]
  ]
};
