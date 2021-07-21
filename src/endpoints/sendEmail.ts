import { PromiseResult } from "aws-sdk/lib/request";
import { appVariables } from "../resources/appVariables";
import aws from "../resources/aws";

const ses = new aws.SES();

export interface ISendEmailProps {
    emailAddresses: string[];
    title: string;
    htmlContent: string;
    textContent: string;
}

async function sendEmail(
    props: ISendEmailProps
): Promise<PromiseResult<aws.SES.SendEmailResponse, aws.AWSError> | null> {
    if (appVariables.disableEmail) {
        return null;
    }

    const { emailAddresses, title, textContent, htmlContent } = props;

    try {
        const result = await ses
            .sendEmail({
                Destination: {
                    ToAddresses: emailAddresses,
                },
                Source: appVariables.emailSendFrom,
                Message: {
                    Subject: {
                        Charset: appVariables.emailEncoding,
                        Data: title,
                    },
                    Body: {
                        Html: {
                            Charset: appVariables.emailEncoding,
                            Data: htmlContent,
                        },
                        Text: {
                            Charset: appVariables.emailEncoding,
                            Data: textContent,
                        },
                    },
                },
            })
            .promise();

        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default sendEmail;
