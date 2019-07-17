"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userError_1 = __importDefault(require("../endpoints/user/userError"));
const jwtConstants_1 = __importDefault(require("../utils/jwtConstants"));
const serverError_1 = __importDefault(require("../utils/serverError"));
function handleErrors(err, req, res) {
    if (err.name === jwtConstants_1.default.errorTypes.unauthorizedError) {
        res.status(200).send({
            errors: [userError_1.default.invalidCredentials]
        });
    }
    else if (err.name === jwtConstants_1.default.errorTypes.tokenExpired) {
        res.status(200).send({
            errors: [userError_1.default.credentialsExpired]
        });
    }
    else {
        res.status(500).send({
            errors: [serverError_1.default.serverError]
        });
    }
    // for debugging purposes
    // TODO: Log error in database, not console
    console.error(err);
}
exports.default = handleErrors;
//# sourceMappingURL=handleErrors.js.map