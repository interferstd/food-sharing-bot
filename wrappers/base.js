class Base {
  constructor(config) {
    this.mongodb = require("mongodb");
    this.connect(config);
  }
  connect(config) {
    this.mongodb.MongoClient(...config).connect((err, db) => {
      if (err !== null) {
        global.Controller.emit("Error", err);
        return;
      }
      global.DataBase = db;
      global.Controller.emit("DataBaseConnected");
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
  set(name, note) {
    var collection = db.collection(name);
    try {
      const resp = collection.insertOne(note);
      console.log(resp);
    } catch (e) {
      global.Controller.emit("Error", e);
    }
  }
  get(name, details) {
    var collection = db.collection(name);
    try {
      const resp = collection.find(details);
      console.log(resp);
    } catch (e) {
      global.Controller.emit("Error", e);
    }
  }
  update(name, details, toUpdate) {
    var collection = db.collection(name);
    try {
      const resp = collection.updateMany(details, { $set: toUpdate });
      console.log(resp);
    } catch (e) {
      global.Controller.emit("Error", e);
    }
  }
  remove(name, details) {
    var collection = db.collection(name);
    try {
      const resp = collection.remove(details);
      console.log(resp);
    } catch (e) {
      global.Controller.emit("Error", e);
    }
  }
}

module.exports = Base;
