const { vk_token } = require("../config.json");
const VK = require('vk-node-sdk')
const User = new VK.User(vk_token)

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
        await User.api("wall.get",{
            //owner_id: -1,
            domain: domain,
            count: count,
            filter: "others",
            //extended: 1
        },function(data){
            console.log(data.items.map(item => item.text)) //TODO: Как блять достать data отсюда?
        });
    }
}

module.exports = Vk;
