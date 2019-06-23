const mongoose = require("mongoose");

const Status = {
  READY: "READY",
  ERROR: "ERROR",
  CONNECTING: "CONNECTING"
};

class MongoConnection {
  constructor(uri, options) {
    this.connection = mongoose.createConnection(uri, options);
    this.status = Status.CONNECTING;
    this.error = null;
    this.statusPromise = new Promise((resolve, reject) => {
      this.connection.once("open", () => {
        resolve(this);
      });

      this.connection.on("error", error => {
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
