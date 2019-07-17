"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MongoModel_1 = __importDefault(require("../MongoModel"));
const schema_1 = __importDefault(require("./schema"));
const modelName = "block";
const collectionName = "blocks";
class BlockModel extends MongoModel_1.default {
    constructor({ connection }) {
        super({
            connection,
            modelName,
            collectionName,
            rawSchema: schema_1.default
        });
    }
}
exports.default = BlockModel;
//# sourceMappingURL=BlockModel.js.map