class Base {
  constructor(config) {
    this.mongodb = require("mongodb");
    this.connect(config);
    //this. = db.collection('');
  }
  connect(config) {
    this.mongodb.MongoClient(...config).connect((err, db) => {
      if (err !== null) {
        global.Scenes.Controller.emit("Error", err);
        return;
      }
      global.DataBase = db;
      global.Scenes.Controller.emit("DataBaseConnected");
    });
  }
  static get(config) {
    return new Base(config);
  }
  setProduct(product){
    //TODO: запилить в БД объект вида : {
    //       _id: undefined, // ID продукта
    //       authId: null, // это ID пользователя, отправившего продукт
    //       name: null, // название продукта
    //       photos: [], // массив ссылок на фотографии
    //       category: null, // категория
    //       burnTime: null,
    //       from: null
    //     }
  }
  getProduct(id){
    //TODO: запилить получение продукта по id;
  }
  middleware() {
    return (ctx, next) => {
      ctx.base = this;
      next();
    };
  }
}

module.exports = Base;
