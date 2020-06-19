async function initScenes(path) {
  const dir = await require("fs").promises.opendir(path);
  for await (const dirent of dir) require("../" + path + dirent.name);
}
if (global.ScenesController === undefined) initScenes("./scenes/");

module.exports = require("./Scenes");
