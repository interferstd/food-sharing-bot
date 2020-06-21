const dicts = require("./dicts.json");
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

function relevance(product, user) {
  return (
    product.category.filter(item => user.preferences[item]).length &&
    distance(
      user.location.latitude,
      user.location.longitude,
      product.location.latitude,
      product.location.longitude
    ) < Number(user.radius)
  );
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

function generateMessage(obj) {
  return (
    `${obj.name ? obj.name + "\n" : ""}` +
    // todo: добавить расстояние до пользователя как часть объекта
    `${obj.distance ? obj.distance + " км до места\n" : ""}` +
    `${obj.city ? "🏢 Город: " + obj.city + "\n" : ""}` +
    `${
      obj.burnTime
        ? "⏰ Истекает через " + obj.burnTime.getHours() + " часов\n"
        : ""
    }` +
    `${obj.commentary ? "📄 " + obj.commentary + "\n" : ""}` +
    `${
      obj.category.length
        ? "🍰 Категории:\n" + obj.category.map(elm => elm + " ") + "\n\n"
        : ""
    }` +
    `${obj.profileLink ? `📞 Связь: ${obj.profileLink}` : "Контактов нет"}`
  );
}

module.exports = { relevance, generateMessage, distance, foodParser };
