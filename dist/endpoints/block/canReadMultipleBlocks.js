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
const canReadBlock_1 = __importDefault(require("./canReadBlock"));
function canReadMultipleBlocks({ blocks, user }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all(blocks.map(block => {
            return canReadBlock_1.default({ block, user });
        }));
    });
}
exports.default = canReadMultipleBlocks;
//# sourceMappingURL=canReadMultipleBlocks.js.map