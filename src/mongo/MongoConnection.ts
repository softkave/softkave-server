import mongoose from "mongoose";

export enum ConnectionStatus {
  READY = "READY",
  ERROR = "ERROR",
  CONNECTING = "CONNECTING"
}

class MongoConnection {
  private connection: mongoose.Connection;
  private status: ConnectionStatus;
  private statusPromise: Promise<MongoConnection>;

  constructor(uri: string, options: mongoose.ConnectionOptions) {
    this.connection = mongoose.createConnection(uri, options);
    this.status = ConnectionStatus.CONNECTING;
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
        this.status = ConnectionStatus.READY;
      })
      .catch(error => {
        this.status = ConnectionStatus.ERROR;
        throw error;
      });
  }

  public getConnection() {
    return this.connection;
  }

  public getStatus() {
    return this.status;
  }

  public isReady() {
    return this.status === ConnectionStatus.READY;
  }

  public wait() {
    return this.statusPromise;
  }
}

export default MongoConnection;
