if (global.ScenesController === undefined)
  ["Configuration", "GiveFood"].map(name => {
    require("./" + name);
  });

module.exports = require("./Scenes");
