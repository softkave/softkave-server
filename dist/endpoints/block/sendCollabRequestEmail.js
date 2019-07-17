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
const collaborationRequestHTML_1 = require("../../html/collaborationRequestHTML");
const appInfo_1 = __importDefault(require("../../res/appInfo"));
const aws_1 = __importDefault(require("../../res/aws"));
const ses = new aws_1.default.SES();
const clientSignupRoute = "/signup";
const clientLoginRoute = "/login";
function sendCollabReqEmail({ email, userName, blockName, message, expires }) {
    return __awaiter(this, void 0, void 0, function* () {
        const signupLink = `${appInfo_1.default.clientDomain}${clientSignupRoute}`;
        const loginLink = `${appInfo_1.default.clientDomain}${clientLoginRoute}`;
        const contentParams = {
            message,
            signupLink,
            loginLink,
            expiration: expires,
            fromOrg: blockName,
            fromUser: userName
        };
        const htmlContent = collaborationRequestHTML_1.collaborationRequestHTML(contentParams);
        const textContent = collaborationRequestHTML_1.collaborationRequestText(contentParams);
        const result = yield ses
            .sendEmail({
            Destination: {
                ToAddresses: [email]
            },
            Source: appInfo_1.default.defaultEmailSender,
            Message: {
                Subject: {
                    Charset: appInfo_1.default.defaultEmailEncoding,
                    Data: collaborationRequestHTML_1.collaborationRequestMailTitle
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
exports.default = sendCollabReqEmail;
//# sourceMappingURL=sendCollabRequestEmail.js.map