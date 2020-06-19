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
  middleware() {
    return (ctx, next) => {
      ctx.base = this;
      next();
    };
  }
  sendProduct(obj){

  }
}

module.exports = Base;
