require("./Scenes");
const { relevance, generateMessage, foodParser } = require("../relevant");

async function sendForAll(product) {
  const users = await global.DataBaseController.get("config");
  users = users.filter(user => relevant(product, user) && user.alerts);
  const idArray = users.map(elm => elm._id);
  for (var id of idArray) {
    if (product.photos != []) {
      await global.bot.telegram.sendMediaGroup(
        id,
        product.photos.map(function(item, index) {
          return { type: "photo", media: item.id };
        })
      );
    }
    await global.bot.telegram.sendMessage(id, generateMessage(product));
  }
}

async function getVkEvent(post) {
  if (!foodParser(post.text).length) return;
  let productPost = {
    _id: undefined, // ID продукта
    authId: null,
    name: null, // название продукта //TODO из парсинга вытащить данные о продукте
    photos: post.att.map(e => {
      return { id: e.photo };
    }), // массив ссылок на фотографии
    category: foodParser(post.text),
    burnTime: null,
    location: post.location,
    isReserved: false,
    city: null,
    commentary: post.text,
    profileLink: post.url
  };
  console.log(productPost);
  const newProduct = await global.DataBaseController.set(
    "product",
    productPost
  );
  global.Controller.emit("newProduct", newProduct);
}

async function checkVkPost(post) {
  const details = { _id: post._id };
  const res = await global.DataBaseController.get("vkPosts", details);
  if (res.length === 0) {
    const res = await global.DataBaseController.set("vkPosts", post);
    global.Controller.emit("newVkPost", post);
  }
}
async function checkVkPosts(posts) {
  for (var post of posts) await checkVkPost(post);
}

global.Controller.struct = {
  on: [
    ["Error", console.log],
    ["newProduct", sendForAll],
    ["checkVkPosts", checkVkPosts],
    ["newVkPost", getVkEvent]
  ]
};
