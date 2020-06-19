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
  sendBaseConfig(obj){
    /*
    obj = {
      name: string,
      city: string,
      location: {
        "latitude": 55.641149,
        "longitude": 37.328438
      }
    }
    */
  }
}

module.exports = Base;
