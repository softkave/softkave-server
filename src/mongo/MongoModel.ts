import mongoose from "mongoose";

export interface IDerivedMongoModelInitializationProps {
  connection: mongoose.Connection;
}

export interface IMongoModelParameters {
  rawSchema: mongoose.SchemaDefinition;
  modelName: string;
  collectionName: string;
  connection: mongoose.Connection;
}

class MongoModel<DocumentType extends mongoose.Document = any> {
  public connection: mongoose.Connection;
  public rawSchema: mongoose.SchemaDefinition;
  public modelName: string;
  public collectionName: string;
  public schema: mongoose.Schema;
  public model: mongoose.Model<DocumentType>;

  constructor({
    connection,
    rawSchema,
    modelName,
    collectionName
  }: IMongoModelParameters) {
    this.connection = connection;
    this.rawSchema = rawSchema;
    this.schema = new mongoose.Schema(rawSchema);
    this.modelName = modelName;
    this.collectionName = collectionName;
    this.model = this.newModel();
  }

  public newModel() {
    return this.connection.model<DocumentType>(
      this.modelName,
      this.schema,
      this.collectionName
    );
  }
}

export default MongoModel;
