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
        var ret = undefined;
        function getPosto(item) {
          for (var photo in item)
            if (/(\w)_(\d\d*)/.test(photo)) {
              ret = item[photo];
              break;
            }
          return ret;
        }
        const posts = data.items.map(item => {
          var location = undefined;
          const post = {
            _id: item.id,
            url: "https://vk.com/id" + item.from_id,
            text: item.text,
            att: ((item.attachments && console.log(item.attachments)) || [])
              .filter(photo => photo.type === "photo")
              .map(photo => photo.photo)
              .map(item => {
                console.log(item);
                const photo = {
                  user_id: item.user_id,
                  key: item.access_key,
                  photo: getPosto(item)
                };
                if (!location && item.lat && item.long)
                  location = {
                    latitude: item.lat,
                    longitude: item.long
                  };
                return photo;
              })
          };
          post.location = location;
          return post;
        });
        global.Controller.emit("checkVkPosts", posts);
      }
    );
  }
}
// await ctx.vk.getPosts("sharingfood", 5); //TODO: vk
module.exports = Vk;
