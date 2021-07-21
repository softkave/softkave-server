import { Moment } from "moment";
import querystring from "querystring";
import {
    forganizationotPasswordEmailHTML,
    forganizationotPasswordEmailText,
    forganizationotPasswordEmailTitle,
} from "../../html/forganizationotPasswordEmail";
import appInfo from "../../resources/appInfo";
import sendEmail from "../sendEmail";

const clientDomain = appInfo.clientDomain;
const changePasswordRoute = "/change-password";

export interface ISendChangePasswordEmailParameters {
    emailAddress: string;
    query: Record<string, string | number | boolean>;
    expiration: Moment;
}

async function sendChangePasswordEmail({
    emailAddress,
    query,
    expiration,
}: ISendChangePasswordEmailParameters) {
    const link = `${clientDomain}${changePasswordRoute}?${querystring.stringify(
        query
    )}`;

    const htmlContent = forganizationotPasswordEmailHTML({ link, expiration });
    const textContent = forganizationotPasswordEmailText({ link, expiration });

    return await sendEmail({
        htmlContent,
        textContent,
        title: forganizationotPasswordEmailTitle,
        emailAddresses: [emailAddress],
    });
}

export default sendChangePasswordEmail;
