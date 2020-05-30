import mongoose from "mongoose";

export enum ConnectionStatus {
  Ready = "Ready",
  Error = "Error",
  Connecting = "Connecting",
}

class MongoConnection {
  private connection: mongoose.Connection;
  private status: ConnectionStatus;
  private statusPromise: Promise<MongoConnection>;

  constructor(uri: string, options: mongoose.ConnectionOptions) {
    this.connection = mongoose.createConnection(uri, options);
    this.status = ConnectionStatus.Connecting;
    this.statusPromise = new Promise((resolve, reject) => {
      this.connection.once("open", () => {
        resolve(this);
      });

      this.connection.on("error", (error) => {
        reject(error);
      });
    });

    this.statusPromise
      .then(() => {
        this.status = ConnectionStatus.Ready;
      })
      .catch((error) => {
        this.status = ConnectionStatus.Error;
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
    return this.status === ConnectionStatus.Ready;
  }

  public wait() {
    return this.statusPromise;
  }
}

export default MongoConnection;
