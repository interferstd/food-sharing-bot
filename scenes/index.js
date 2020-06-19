if (global.ScenesController === undefined)
  ["Main", "Start", "GiveFood", "TakeFood"].map(name => {
    require("./" + name);
  });

module.exports = require("./Scenes");
