import {
    collaborationRequestRevokedEmailHTML,
    collaborationRequestRevokedEmailText,
    ICollaborationRequestRevokedEmailProps,
} from "../../html/collaborationRequestRevokedEmail";
import appInfo from "../../resources/appInfo";
import aws from "../../resources/aws";

const ses = new aws.SES();

export interface ISendCollaborationRequestRevokedEmailProps
    extends ICollaborationRequestRevokedEmailProps {
    email: string;
}

async function sendCollaborationRequestRevokedEmail(
    props: ISendCollaborationRequestRevokedEmailProps
) {
    try {
        const htmlContent = collaborationRequestRevokedEmailHTML(props);
        const textContent = collaborationRequestRevokedEmailText(props);

        const result = await ses
            .sendEmail({
                Destination: {
                    ToAddresses: [props.email],
                },
                Source: appInfo.defaultEmailSender,
                Message: {
                    Subject: {
                        Charset: appInfo.defaultEmailEncoding,
                        Data: props.title,
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

export default sendCollaborationRequestRevokedEmail;
