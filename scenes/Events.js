require("./Scenes");


function generateMessage(obj) {
  return `${obj.name?obj.name+"\n":''}`
      // todo: добавить расстояние до пользователя как часть объекта
      +`${obj.distance?obj.distance+" км до места\n":''}`
      +`${obj.city?"Город: "+obj.city+'🏢\n':''}`
      +`${obj.burnTime?"Истекает через "+obj.burnTime.getHours()+" часов\n":''}`
      +`${obj.commentary?obj.commentary+"\n":''}`
      +`${obj.category.length?obj.category.map(elm=>elm+" ")+"\n":''}`
      +`${obj.profileLink?`Связь: ${obj.profileLink}`:"Контактов нет"}`
}

function distance(lat1, lon1, lat2, lon2) {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    let radlat1 = (Math.PI * lat1) / 180;
    let radlat2 = (Math.PI * lat2) / 180;
    let theta = lon1 - lon2;
    let radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    return dist * 1.609344;
  }
}

async function sendForAll(product) {
  const users = await global.DataBaseController.get("config");
  const idArray = users.map(elm => elm._id);
  idArray.map(async id => {
    await global.ctx.telegram.sendMediaGroup(
        id,
        product.photos.map(function(item, index) {
          return { type: "photo", media: item.id }
        })
    );
    await global.ctx.telegram.sendMessage(id, generateMessage(product));
  });
}

async function getVkEvent(post) {
  console.log(post);
}

async function checkVkPost(post) {
  const details = { _id: post._id };
  const res = await global.DataBaseController.get("vkPosts", details);
  console.log(details, res);
  if (res.length === 0) {
    const res = await global.DataBaseController.set("vkPosts", post);
    global.Controller.emit("newVkPost", post);
  }
}
async function checkVkPosts(posts) {
  console.log(posts);
  posts.map(checkVkPost);
}

global.Controller.struct = {
  on: [
    ["Error", console.log],
    ["newProduct", sendForAll],
    ["checkVkPosts", checkVkPosts],
    ["newVkPost", getVkEvent]
  ]
}
