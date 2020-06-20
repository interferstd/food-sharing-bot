const { vk_token } = require("./config.json");
const VK = require("vk-node-sdk");
const User = new VK.User(vk_token);

class Vk {
  constructor() {
    this.main = async () => {};
  }
  static get(config) {
    return new Vk(config);
  }
  middleware() {
    return (ctx, next) => {
      ctx.vk = this;
      next();
    };
  }
  async getPosts(domain, count) {
    await User.api(
      "wall.get",
      {
        // owner_id: -1,
        // fields: {},
        domain: domain,
        count: count,
        filter: "others",
        extended: 1
      },
      function(data) {
        var ret = "",
          max = 0;
        function getPosto(item) {
          for (var photo in item)
            if (/(\w)_(\d\d*)/.test(photo)) {
              const size = +photo.match(/(\w)_(\d\d*)/)[2];
              if (size > max) {
                max = size;
                ret = item[photo];
              }
            }
          return ret;
        }
        const post = data.items
          .map(item => {
            return {
              text: item.text,
              att: item.attachments
                .map(photo => photo.photo)
                .map(item => {
                  const photo = {
                    user_id: item.user_id,
                    key: item.access_key,
                    photo: getPosto(item)
                  };
                  if (!post.location && item.lat && item.long)
                    post.location = {
                      latitude: item.lat,
                      longitude: item.long
                    };
                  return photo;
                })
            };
          })
          .map(post => global.Controller.emit("newVkPost", post));
      }
    );
  }
}
// await ctx.vk.getPosts("sharingfood", 5); //TODO: vk
module.exports = Vk;
