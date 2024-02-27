import mongoose from 'mongoose';

export interface IMongoModelParameters {
  rawSchema: any;
  modelName: string;
  collectionName: string;
  connection: mongoose.Connection;
  schemaOptions?: mongoose.SchemaOptions;
}

class MongoModel<T = any> {
  connection: mongoose.Connection;
  rawSchema: any;
  modelName: string;
  collectionName: string;
  schema: mongoose.Schema;
  model: mongoose.Model<T>;

  private isIndexReady = false;

  constructor(props: IMongoModelParameters) {
    this.connection = props.connection;
    this.rawSchema = props.rawSchema;
    this.schema = new mongoose.Schema(props.rawSchema, props.schemaOptions);
    this.modelName = props.modelName;
    this.collectionName = props.collectionName;
    this.model = this.newModel();
  }

  newModel() {
    return this.connection.model<T>(this.modelName, this.schema, this.collectionName);
  }

  isReady() {
    return this.isIndexReady;
  }
}

export default MongoModel;
