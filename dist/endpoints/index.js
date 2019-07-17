"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const schema_utils_1 = require("../utils/schema-utils");
const block_1 = require("./block");
const schema_1 = __importDefault(require("./schema"));
const user_1 = require("./user");
// TODO: define all any types
class IndexOperations {
    constructor(params) {
        this.staticParams = params;
    }
    user() {
        return __awaiter(this, void 0, void 0, function* () {
            return new user_1.UserOperations(this.staticParams);
        });
    }
    block() {
        return __awaiter(this, void 0, void 0, function* () {
            return new block_1.BlockOperations(this.staticParams);
        });
    }
}
exports.IndexOperations = IndexOperations;
const rootSchema = `
  ${schema_utils_1.utilitySchema}
  ${user_1.userSchema}
  ${block_1.blockSchema}
  ${schema_1.default}
`;
const compiledSchema = graphql_1.buildSchema(rootSchema);
exports.indexSchema = compiledSchema;
//# sourceMappingURL=index.js.map