import {
  assignedTaskEmailNotificationHTML,
  assignedTaskEmailNotificationText,
  assignedTaskEmailNotificationTitle,
  IAssignedTaskEmailNotificationProps,
} from "../../../html/assignedTaskEmailNotification";
import appInfo from "../../../res/appInfo";
import aws from "../../../res/aws";

const ses = new aws.SES();

export interface ISendAssignedTaskEmailNotificationProps
  extends IAssignedTaskEmailNotificationProps {
  email: string;
}

async function sendAssignedTaskEmailNotification(
  props: ISendAssignedTaskEmailNotificationProps
) {
  const htmlContent = assignedTaskEmailNotificationHTML(props);
  const textContent = assignedTaskEmailNotificationText(props);

  const result = await ses
    .sendEmail({
      Destination: {
        ToAddresses: [props.email],
      },
      Source: appInfo.defaultEmailSender,
      Message: {
        Subject: {
          Charset: appInfo.defaultEmailEncoding,
          Data: assignedTaskEmailNotificationTitle,
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
}

export default sendAssignedTaskEmailNotification;
