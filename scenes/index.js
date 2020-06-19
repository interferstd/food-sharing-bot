if (global.ScenesController === undefined)
  ["Configuration"].map(name => {
    require("./" + name);
  });

module.exports = require("./Scenes");
