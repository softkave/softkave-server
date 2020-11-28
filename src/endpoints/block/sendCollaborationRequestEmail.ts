import {
    collaborationRequestEmailHTML,
    collaborationRequestEmailText,
    collaborationRequestEmailTitle,
    ICollaborationRequestEmailProps,
} from "../../html/collaborationRequestEmail";
import appInfo from "../../resources/appInfo";
import aws from "../../resources/aws";

const ses = new aws.SES();

export interface ISendCollaborationRequestEmailProps
    extends ICollaborationRequestEmailProps {
    email: string;
}

async function sendCollabReqEmail(props: ISendCollaborationRequestEmailProps) {
    try {
        const htmlContent = collaborationRequestEmailHTML(props);
        const textContent = collaborationRequestEmailText(props);

        const result = await ses
            .sendEmail({
                Destination: {
                    ToAddresses: [props.email],
                },
                Source: appInfo.defaultEmailSender,
                Message: {
                    Subject: {
                        Charset: appInfo.defaultEmailEncoding,
                        Data: collaborationRequestEmailTitle,
                    },
                    Body: {
                        Html: {
                            Charset: appInfo.defaultEmailEncoding,
                            Data: htmlContent,
                        },
                        Text: {
                            Charset: appInfo.defaultEmailEncoding,
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

export default sendCollabReqEmail;
