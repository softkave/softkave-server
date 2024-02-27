import {Connection, ConnectOptions, createConnection} from 'mongoose';

export enum ConnectionStatus {
  Ready = 'Ready',
  Error = 'Error',
  Connecting = 'Connecting',
}

class MongoConnection {
  private connection: Connection;
  private status: ConnectionStatus;
  private statusPromise: Promise<MongoConnection>;

  constructor(uri: string, options: ConnectOptions = {}) {
    this.connection = createConnection(uri, options);
    this.status = ConnectionStatus.Connecting;
    this.statusPromise = new Promise((resolve, reject) => {
      this.connection.once('open', () => {
        resolve(this);
      });

      this.connection.on('error', error => {
        reject(error);
      });
    });

    this.statusPromise
      .then(() => {
        this.status = ConnectionStatus.Ready;
      })
      .catch(error => {
        this.status = ConnectionStatus.Error;
        throw error;
      });
  }

  getConnection() {
    return this.connection;
  }

  async close() {
    await this.connection.close();
  }

  getStatus() {
    return this.status;
  }

  isReady() {
    return this.status === ConnectionStatus.Ready;
  }

  wait() {
    return this.statusPromise;
  }
}

export default MongoConnection;
