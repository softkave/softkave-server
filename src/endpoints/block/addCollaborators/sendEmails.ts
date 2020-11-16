import moment from "moment";
import { IBlock } from "../../../mongo/block/definitions";
import {
    INotification,
    INotificationSentEmailHistoryItem,
} from "../../../mongo/notification";
import { IUser } from "../../../mongo/user";
import appInfo from "../../../res/appInfo";
import { getDate } from "../../../utilities/fns";
import waitOnPromises, {
    IPromiseWithId,
} from "../../../utilities/waitOnPromises";
import { getPublicNotificationData } from "../../notifications/utils";
import RequestData from "../../RequestData";
import { fireAndForgetPromise } from "../../utils";
import { IAddCollaboratorsContext } from "./types";

export interface IAddCollaboratorsSendEmailsFnProps {
    user: IUser;
    block: IBlock;
    indexedExistingUsers: { [key: string]: IUser };
    requests: INotification[];
}

export default async function sendEmails(
    context: IAddCollaboratorsContext,
    instData: RequestData,
    data: IAddCollaboratorsSendEmailsFnProps
) {
    const { user, block, indexedExistingUsers, requests } = data;

    const sendEmailPromises: IPromiseWithId[] = requests.map(
        (request, index) => {
            const promise = context.sendCollaborationRequestEmail({
                email: request.to.email,
                senderName: user.name,
                senderOrg: block.name,
                message: request.body,
                expiration: request.expiresAt
                    ? moment(request.expiresAt)
                    : null,
                loginLink: `${appInfo.clientDomain}/login`,
                recipientIsUser: !!indexedExistingUsers[request.to.email],
                signupLink: `${appInfo.clientDomain}/signup`,
            });

            return {
                promise,
                id: index,
            };
        }
    );

    // TODO: Resend collaboration requests that have not been sent or that failed

    const settledPromises = await waitOnPromises(sendEmailPromises);
    const successfulRequests: INotification[] = settledPromises
        .filter(({ fulfilled }) => fulfilled)
        .map(({ id }) => {
            return requests[id];
        });

    const sentEmailItem: INotificationSentEmailHistoryItem = {
        date: getDate(),
    };

    const updates = successfulRequests.map((req) => ({
        id: req.customId,
        data: {
            sentEmailHistory: req.sentEmailHistory.concat(sentEmailItem),
        },
    }));

    fireAndForgetPromise(
        context.notification.bulkUpdateNotificationsById(context, updates)
    );

    // TODO: public data vs internal
    context.broadcastHelpers.broadcastCollaborationRequestsUpdateToBlock(
        context,
        block,
        updates.map((update) => ({
            ...update,
            data: getPublicNotificationData(update.data),
        })),
        instData
    );
}
