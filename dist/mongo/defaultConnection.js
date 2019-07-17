"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MongoConnection_1 = __importDefault(require("./MongoConnection"));
const MONGODB_URI = process.env.MONGODB_URI;
const options = {
    useNewUrlParser: true
};
const connection = new MongoConnection_1.default(MONGODB_URI, options);
exports.default = connection;
//# sourceMappingURL=defaultConnection.js.map