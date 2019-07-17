"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class MongoModel {
    constructor({ connection, rawSchema, modelName, collectionName }) {
        this.connection = connection;
        this.rawSchema = rawSchema;
        this.schema = new mongoose_1.default.Schema(rawSchema);
        this.modelName = modelName;
        this.collectionName = collectionName;
        this.model = this.newModel();
    }
    newModel() {
        return this.connection.model(this.modelName, this.schema, this.collectionName);
    }
}
exports.default = MongoModel;
//# sourceMappingURL=MongoModel.js.map