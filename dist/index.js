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
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_graphql_1 = __importDefault(require("express-graphql"));
const express_jwt_1 = __importDefault(require("express-jwt"));
const defaultConnection_1 = __importDefault(require("./mongo/defaultConnection"));
const endpoints_1 = require("./endpoints");
const handleErrors_1 = __importDefault(require("./middlewares/handleErrors"));
const httpToHttps_1 = __importDefault(require("./middlewares/httpToHttps"));
const AccessControlModel_1 = __importDefault(require("./mongo/access-control/AccessControlModel"));
const BlockModel_1 = __importDefault(require("./mongo/block/BlockModel"));
const NotificationModel_1 = __importDefault(require("./mongo/notification/NotificationModel"));
const UserModel_1 = __importDefault(require("./mongo/user/UserModel"));
const userModel = new UserModel_1.default({ connection: defaultConnection_1.default.getConnection() });
const blockModel = new BlockModel_1.default({ connection: defaultConnection_1.default.getConnection() });
const notificationModel = new NotificationModel_1.default({
    connection: defaultConnection_1.default.getConnection()
});
const accessControlModel = new AccessControlModel_1.default({
    connection: defaultConnection_1.default.getConnection()
});
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not present");
}
const app = express_1.default();
const port = process.env.PORT || 5000;
const whiteListedCorsOrigins = [/^https:\/\/www.softkave.com$/];
let graphiql = false;
if (process.env.NODE_ENV !== "production") {
    whiteListedCorsOrigins.push(/localhost/);
    graphiql = true;
}
const corsOption = {
    origin: whiteListedCorsOrigins,
    optionsSuccessStatus: 200
};
if (process.env.NODE_ENV === "production") {
    app.use(httpToHttps_1.default);
}
app.use(cors_1.default(corsOption));
app.use(express_jwt_1.default({
    secret: JWT_SECRET,
    credentialsRequired: false
}));
app.use(body_parser_1.default.json({
    type: "application/json"
}));
app.use("/graphql", express_graphql_1.default({
    graphiql,
    schema: endpoints_1.indexSchema,
    rootValue: new endpoints_1.IndexOperations({
        blockModel,
        notificationModel,
        userModel,
        accessControlModel
    })
}));
app.use(handleErrors_1.default);
defaultConnection_1.default.wait().then(() => __awaiter(this, void 0, void 0, function* () {
    yield userModel.model.init();
    yield blockModel.model.init();
    yield notificationModel.model.init();
    app.listen(port, () => {
        console.log("SOFTKAVE");
        console.log("server started");
        console.log("port: " + port);
    });
}));
//# sourceMappingURL=index.js.map