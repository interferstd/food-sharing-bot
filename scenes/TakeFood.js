const { Scene, Markup } = require("./Scenes");

const distance = function(lat1, lon1, lat2, lon2) {
  if (lat1 == lat2 && lon1 == lon2) {
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
};

function generateMessage(obj) {
  return `${obj.name?obj.name+"\n":''}`
      // todo: добавить расстояние до пользователя как часть объекта
      +`${obj.distance?obj.distance+" км до места\n":''}`
      +`${obj.city?"Город: "+obj.city+'\n':''}`
      +`${obj.burnTime?"Истекает через "+obj.burnTime.getHours()+" часов\n":''}`
      +`${obj.commentary?obj.commentary+"\n":''}`
      +`${obj.category.length?obj.category.map(elm=>elm+" ")+"\n":''}`
}

new (class TakeFood extends Scene {
  constructor() {
    super("TakeFood");
    super.struct = {
      on: [["text", this.onText]],
      enter: [[this.enter]]
    };
  }
  async enter(ctx) {
    ctx.reply(
      'Вы зашли в раздел "Взять еду"',
      Markup.keyboard(["Назад"])
        .oneTime()
        .resize()
        .extra()
    );
    const user = await ctx.base.get("config", { _id: ctx.from.id });
    const lots = await ctx.base.get("product");
    const userLocation = user[0].location;

    const trueLots = lots.filter(function(item) {
      if (item.location.latitude && item.location.longitude)
        if (
          distance(
            userLocation.latitude,
            userLocation.longitude,
            item.location.latitude,
            item.location.longitude
          ) <= Number(user[0].radius)
        )
          return item;
    });
    trueLots.map(async lot => {
      await ctx.reply(`Название: ${lot.name}\nОписание: ${lot.commentary}`);
      await ctx.telegram.sendMediaGroup(
        ctx.from.id,
        lot.photos.map(function(item) {
          return { type: "photo", media: item.id };
        })
      );
    });
  }
  async onText(ctx) {
    switch (ctx.message.text) {
      case "Назад":
        await ctx.scene.enter("Main");
        break;
      default:
        await ctx.reply("Wrong!");
        break;
    }
  }
})();
