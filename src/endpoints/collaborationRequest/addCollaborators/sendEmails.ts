import {
    CollaborationRequestEmailReason,
    ICollaborationRequest,
} from "../../../mongo/collaboration-request";
import { IUser } from "../../../mongo/user";
import appInfo from "../../../resources/appInfo";
import { getDate } from "../../../utilities/fns";
import { IUpdateItemById } from "../../../utilities/types";
import waitOnPromises, {
    IPromiseWithId,
} from "../../../utilities/waitOnPromises";
import { IPublicCollaborationRequest } from "../../notifications/types";
import { getPublicCollaborationRequest } from "../../notifications/utils";
import { IOrganization } from "../../organization/types";
import RequestData from "../../RequestData";
import { fireAndForganizationetPromise } from "../../utils";
import { IAddCollaboratorsContext } from "./types";

export interface IAddCollaboratorsSendEmailsFnProps {
    user: IUser;
    organization: IOrganization;
    indexedExistingUsers: { [key: string]: IUser };
    requests: ICollaborationRequest[];
}

export default async function sendEmails(
    context: IAddCollaboratorsContext,
    instData: RequestData,
    data: IAddCollaboratorsSendEmailsFnProps
) {
    const { user, organization, indexedExistingUsers, requests } = data;

    // TODO: should we send emails only to people who aren't users?
    const sendEmailPromises: IPromiseWithId[] = requests.map(
        (request, index) => {
            const promise = context.sendCollaborationRequestEmail({
                email: request.to.email,
                senderName: user.name,
                senderOrganization: organization.name,
                title: request.title,
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
    const successfulRequests: ICollaborationRequest[] = settledPromises
        .filter(({ fulfilled }) => fulfilled)
        .map(({ id }) => {
            return requests[id];
        });

    const socketUpdates: Array<IUpdateItemById<IPublicCollaborationRequest>> =
        [];

    successfulRequests.forEach((req) => {
        const sentEmailHistory = req.sentEmailHistory.concat({
            date: getDate(),
            reason: CollaborationRequestEmailReason.RequestNotification,
        });

        socketUpdates.push({
            id: req.customId,
            data: getPublicCollaborationRequest({
                sentEmailHistory,
            }),
        });

        // TODO: we should preferrably bulk update, but bulk update is not
        // working because of something about atomic operators not being present.
        // Should look into this, and find solutions.
        // I also noticed it mostly for arrays, cause sprint bulk updates work just
        // fine for scalar values, though I haven't tested array updates in sprint bulk updates
        fireAndForganizationetPromise(
            context.collaborationRequest.updateCollaborationRequestById(
                context,
                req.customId,
                {
                    sentEmailHistory,
                }
            )
        );
    });

    // TODO: public data vs internal
    context.broadcastHelpers.broadcastCollaborationRequestsUpdateToBlock(
        context,
        instData,
        organization,
        socketUpdates
    );
}
