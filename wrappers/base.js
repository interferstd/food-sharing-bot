class Base {
  constructor(config) {
    this.mongodb = require("mongodb");
    this.connect(config);
  }
  connect(config) {
    this.mongodb.MongoClient(...config).connect((err, client) => {
      if (err !== null) {
        global.Controller.emit("Error", err);
        return;
      }
      global.DataBase = client.db("foodshare");
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
  async set(name, note) {
    var collection = global.DataBase.collection(name);
    try {
      const resp = await collection.insertOne(note);
      return resp.ops[0];
    } catch (e) {
      global.Controller.emit("Error", e);
    }
  }
  async get(name, details) {
    var collection = global.DataBase.collection(name);
    try {
      const resp = await collection.find(details).toArray();
      return resp;
    } catch (e) {
      global.Controller.emit("Error", e);
    }
  }
  async update(name, details, toUpdate) {
    var collection = global.DataBase.collection(name);
    try {
      const resp = await collection.updateMany(details, { $set: toUpdate });
      return resp.ops;
    } catch (e) {
      global.Controller.emit("Error", e);
    }
  }
  async remove(name, details) {
    var collection = global.DataBase.collection(name);
    try {
      const resp = await collection.remove(details);
      return resp.ops;
    } catch (e) {
      global.Controller.emit("Error", e);
    }
  }
}

module.exports = Base;
