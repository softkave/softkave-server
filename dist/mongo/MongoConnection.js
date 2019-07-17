"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus["READY"] = "READY";
    ConnectionStatus["ERROR"] = "ERROR";
    ConnectionStatus["CONNECTING"] = "CONNECTING";
})(ConnectionStatus = exports.ConnectionStatus || (exports.ConnectionStatus = {}));
class MongoConnection {
    constructor(uri, options) {
        this.connection = mongoose_1.default.createConnection(uri, options);
        this.status = ConnectionStatus.CONNECTING;
        this.statusPromise = new Promise((resolve, reject) => {
            this.connection.once("open", () => {
                resolve(this);
            });
            this.connection.on("error", error => {
                reject(error);
            });
        });
        this.statusPromise
            .then(() => {
            this.status = ConnectionStatus.READY;
        })
            .catch(error => {
            this.status = ConnectionStatus.ERROR;
            throw error;
        });
    }
    getConnection() {
        return this.connection;
    }
    getStatus() {
        return this.status;
    }
    isReady() {
        return this.status === ConnectionStatus.READY;
    }
    wait() {
        return this.statusPromise;
    }
}
exports.default = MongoConnection;
//# sourceMappingURL=MongoConnection.js.map