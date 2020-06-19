if (global.ScenesController === undefined)
  ["Main", "Configuration", "GiveFood", "TakeFood"].map(name => {
    require("./" + name);
  });

module.exports = require("./Scenes");
