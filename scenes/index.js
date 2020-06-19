if (global.ScenesController === undefined) {
  const dir = require("fs").readdirSync("./scenes");
  dir.map(name => require("./" + name));
}
module.exports = require("./Scenes");
