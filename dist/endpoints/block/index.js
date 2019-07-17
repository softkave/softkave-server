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
const utils_1 = require("../utils");
const addBlock_1 = __importDefault(require("./addBlock"));
const addCollaborators_1 = __importDefault(require("./addCollaborators"));
const assignRole_1 = __importDefault(require("./assignRole"));
const createRootBlock_1 = __importDefault(require("./createRootBlock"));
const deleteBlock_1 = __importDefault(require("./deleteBlock"));
const getBlock_1 = __importDefault(require("./getBlock"));
const getBlockChildren_1 = __importDefault(require("./getBlockChildren"));
const getBlockCollaborators_1 = __importDefault(require("./getBlockCollaborators"));
const getBlockCollabRequests_1 = __importDefault(require("./getBlockCollabRequests"));
const getRoleBlocks_1 = __importDefault(require("./getRoleBlocks"));
const removeCollaborator_1 = __importDefault(require("./removeCollaborator"));
const revokeRequest_1 = __importDefault(require("./revokeRequest"));
const schema_1 = __importDefault(require("./schema"));
exports.blockSchema = schema_1.default;
const toggleTask_1 = __importDefault(require("./toggleTask"));
const transferBlock_1 = __importDefault(require("./transferBlock"));
const updateAccessControlData_1 = __importDefault(require("./updateAccessControlData"));
const updateBlock_1 = __importDefault(require("./updateBlock"));
const updateRoles_1 = __importDefault(require("./updateRoles"));
function getRequestBlock(arg) {
    return __awaiter(this, void 0, void 0, function* () {
        const block = yield getBlock_1.default(Object.assign({}, arg, { isRequired: true, checkPermission: true }));
        return Object.assign({}, arg, { block });
    });
}
// TODO: define all any types
class BlockOperations {
    constructor(staticParams) {
        const defaultMiddlewares = [utils_1.insertUserCredentials];
        const endpointsWithBlockParamMiddlewares = [
            ...defaultMiddlewares,
            getRequestBlock
        ];
        this.addBlock = utils_1.wrapGraphQLOperation(addBlock_1.default, staticParams, defaultMiddlewares);
        this.updateBlock = utils_1.wrapGraphQLOperation(updateBlock_1.default, staticParams, endpointsWithBlockParamMiddlewares);
        this.deleteBlock = utils_1.wrapGraphQLOperation(deleteBlock_1.default, staticParams, endpointsWithBlockParamMiddlewares);
        this.getBlockChildren = utils_1.wrapGraphQLOperation(getBlockChildren_1.default, staticParams, endpointsWithBlockParamMiddlewares);
        this.addCollaborators = utils_1.wrapGraphQLOperation(addCollaborators_1.default, staticParams, endpointsWithBlockParamMiddlewares);
        this.removeCollaborator = utils_1.wrapGraphQLOperation(removeCollaborator_1.default, staticParams, endpointsWithBlockParamMiddlewares);
        this.getCollaborators = utils_1.wrapGraphQLOperation(getBlockCollaborators_1.default, staticParams, endpointsWithBlockParamMiddlewares);
        this.getCollabRequests = utils_1.wrapGraphQLOperation(getBlockCollabRequests_1.default, staticParams, endpointsWithBlockParamMiddlewares);
        this.getRoleBlocks = utils_1.wrapGraphQLOperation(getRoleBlocks_1.default, staticParams, defaultMiddlewares);
        this.toggleTask = utils_1.wrapGraphQLOperation(toggleTask_1.default, staticParams, endpointsWithBlockParamMiddlewares);
        this.revokeRequest = utils_1.wrapGraphQLOperation(revokeRequest_1.default, staticParams, endpointsWithBlockParamMiddlewares);
        this.updateAccessControlData = utils_1.wrapGraphQLOperation(updateAccessControlData_1.default, staticParams, endpointsWithBlockParamMiddlewares);
        this.assignRole = utils_1.wrapGraphQLOperation(assignRole_1.default, staticParams, endpointsWithBlockParamMiddlewares);
        this.updateRoles = utils_1.wrapGraphQLOperation(updateRoles_1.default, staticParams, endpointsWithBlockParamMiddlewares);
        this.createRootBlock = utils_1.wrapGraphQLOperation(createRootBlock_1.default, staticParams, defaultMiddlewares);
        this.transferBlock = utils_1.wrapGraphQLOperation(transferBlock_1.default, staticParams, defaultMiddlewares);
    }
}
exports.BlockOperations = BlockOperations;
//# sourceMappingURL=index.js.map