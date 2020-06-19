if (global.ScenesController === undefined)
  ["Start"].map(name => {
    require("./" + name);
  });

module.exports = require("./Scenes");
