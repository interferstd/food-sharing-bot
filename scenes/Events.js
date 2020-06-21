require("./Scenes");
const { relevance } = require("../relevant");

const dicts = require("../dicts.json");
function foodParser(text) {
  let obj = [];
  for (let key in dicts) {
    dicts[key].forEach(elm => {
      if (text.toLowerCase().indexOf(elm) > -1 && !obj.includes(key)) {
        obj.push(key);
      }
    });
  }
  return obj;
}

function generateMessage(obj) {
  return (
    `${obj.name ? obj.name + "\n" : ""}` +
    // todo: добавить расстояние до пользователя как часть объекта
    `${obj.distance ? obj.distance + " км до места\n" : ""}` +
    `${obj.city ? "Город: " + obj.city + "🏢\n" : ""}` +
    `${
      obj.burnTime
        ? "Истекает через " + obj.burnTime.getHours() + " часов\n"
        : ""
    }` +
    `${obj.commentary ? obj.commentary + "\n" : ""}` +
    `${obj.category.length ? obj.category.map(elm => elm + " ") + "\n" : ""}` +
    `${obj.profileLink ? `Связь: ${obj.profileLink}` : "Контактов нет"}`
  );
}

async function sendForAll(product) {
  const users = await global.DataBaseController.get("config");
  const idArray = users.filter(function (item){
    global.bot.telegram
         .getChat(product.authId)
         .then(elm => (product.profileLink = "@" + elm.username));
    return relevance(product, item)
  }).map(elm => elm._id);

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
