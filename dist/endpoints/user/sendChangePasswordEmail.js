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
const querystring_1 = __importDefault(require("querystring"));
const changePasswordHTML_1 = require("../../html/changePasswordHTML");
const appInfo_1 = __importDefault(require("../../res/appInfo"));
const aws_1 = __importDefault(require("../../res/aws"));
const ses = new aws_1.default.SES();
const clientDomain = appInfo_1.default.clientDomain;
const changePasswordRoute = "/change-password";
function sendChangePasswordEmail({ emailAddress, query, expiration }) {
    return __awaiter(this, void 0, void 0, function* () {
        const link = `${clientDomain}${changePasswordRoute}?${querystring_1.default.stringify(query)}`;
        const htmlContent = changePasswordHTML_1.changePasswordHTML({ link, expiration });
        const textContent = changePasswordHTML_1.changePasswordText({ link, expiration });
        const result = yield ses
            .sendEmail({
            Destination: {
                ToAddresses: [emailAddress]
            },
            Source: appInfo_1.default.defaultEmailSender,
            Message: {
                Subject: {
                    Charset: appInfo_1.default.defaultEmailEncoding,
                    Data: changePasswordHTML_1.changePasswordMailTitle
                },
                Body: {
                    Html: {
                        Charset: appInfo_1.default.defaultEmailEncoding,
                        Data: htmlContent
                    },
                    Text: {
                        Charset: appInfo_1.default.defaultEmailEncoding,
                        Data: textContent
                    }
                }
            }
        })
            .promise();
        return result;
    });
}
exports.default = sendChangePasswordEmail;
//# sourceMappingURL=sendChangePasswordEmail.js.map