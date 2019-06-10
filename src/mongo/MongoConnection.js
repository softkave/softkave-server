const mongoose = require("mongoose");

class Status {
  static READY = "READY";
  static ERROR = "ERROR";
  static CONNECTING = "CONNECTING";
}

class MongoConnection {
  static Status = Status;

  constructor(uri, options) {
    this.connection = mongoose.createConnection(uri, options);
    this.status = Status.CONNECTING;
    this.error = null;
    this.statusPromise = Promise((resolve, reject) => {
      connection.once("open", () => {
        resolve(this);
      });

      connection.on("error", error => {
        reject(error);
      });
    });

    this.statusPromise
      .then(() => {
        this.status = Status.READY;
      })
      .catch(error => {
        this.status = Status.ERROR;
        this.error = error;
        throw error;
      });
  }

  getConnection() {
    return this.connection;
  }

  getStatus() {
    return this.status;
  }

  ready() {
    return this.status === Status.READY;
  }

  wait() {
    return this.statusPromise;
  }
}

module.exports = MongoConnection;
