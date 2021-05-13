import mongoose from "mongoose";

export interface IMongoModelParameters {
    // rawSchema: mongoose.SchemaDefinition;
    rawSchema: any; // TODO: fix later
    modelName: string;
    collectionName: string;
    connection: mongoose.Connection;
    schemaOptions?: mongoose.SchemaOptions;
}

class MongoModel<DocumentType extends mongoose.Document = any> {
    public connection: mongoose.Connection;
    public rawSchema: mongoose.SchemaDefinition;
    public modelName: string;
    public collectionName: string;
    public schema: mongoose.Schema;
    public model: mongoose.Model<DocumentType>;

    private readyPromise: Promise<any>;
    private isIndexReady: boolean = false;

    constructor(props: IMongoModelParameters) {
        this.init(props);
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
        return this.readyPromise;
    }

    private init({
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

        // TODO: check if connection is successful instead,
        // since ensureIndexes is deprecated
        this.readyPromise = this.model.ensureIndexes().then(() => {
            this.isIndexReady = true;
        });
    }
}

export default MongoModel;
