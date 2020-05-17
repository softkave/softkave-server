import mongoose from "mongoose";

export interface IDerivedMongoModelInitializationProps {
  connection: mongoose.Connection;
}

export interface IMongoModelParameters {
  rawSchema: mongoose.SchemaDefinition;
  modelName: string;
  collectionName: string;
  connection: mongoose.Connection;
  schemaOptions?: mongoose.SchemaOptions;
}

type Waiter = () => void;

class MongoModel<DocumentType extends mongoose.Document = any> {
  public connection: mongoose.Connection;
  public rawSchema: mongoose.SchemaDefinition;
  public modelName: string;
  public collectionName: string;
  public schema: mongoose.Schema;
  public model: mongoose.Model<DocumentType>;

  private isIndexReady: boolean = false;
  private waitingQueue: Waiter[] = [];

  constructor({
    connection,
    rawSchema,
    modelName,
    collectionName,
    schemaOptions,
  }: IMongoModelParameters) {
    this.connection = connection;
    this.rawSchema = rawSchema;
    this.schema = new mongoose.Schema(rawSchema, schemaOptions);
    this.modelName = modelName;
    this.collectionName = collectionName;
    this.model = this.newModel();

    this.model.ensureIndexes().then(() => {
      this.isIndexReady = true;
      this.callWaiters();
    });
  }

  public newModel() {
    return this.connection.model<DocumentType>(
      this.modelName,
      this.schema,
      this.collectionName
    );
  }

  public isReady() {
    return this.isIndexReady;
  }

  public waitTillReady() {
    return new Promise((resolve) => {
      this.queueWaiter(resolve);
    });
  }

  private queueWaiter(cb: Waiter) {
    this.waitingQueue.push(cb);
  }

  private callWaiters() {
    this.waitingQueue.forEach((cb) => cb());
  }
}

export default MongoModel;
