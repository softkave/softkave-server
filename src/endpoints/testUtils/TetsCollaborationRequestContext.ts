import { ICollaborationRequest } from "../../mongo/collaboration-request";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { indexArray } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import { IBaseContext } from "../contexts/BaseContext";
import { ICollaborationRequestContext } from "../contexts/CollaborationRequestContext";

const requests: ICollaborationRequest[] = [];

class TestCollaborationRequestContext implements ICollaborationRequestContext {
    public getCollaborationRequestById = async (
        ctx: IBaseContext,
        id: string
    ) => {
        return requests.find((request) => request.customId === id);
    };

    public updateCollaborationRequestById = async (
        ctx: IBaseContext,
        customId: string,
        data: Partial<ICollaborationRequest>
    ) => {
        const index = requests.findIndex(
            (request) => request.customId === customId
        );

        if (index !== -1) {
            requests[index] = { ...requests[index], ...data };
            return requests[index];
        }
    };

    public getUserCollaborationRequests = async (
        ctx: IBaseContext,
        email: string
    ) => {
        email = email.toLowerCase();
        return requests.filter((request) => request.to.email === email);
    };

    public deleteCollaborationRequestById = async (
        ctx: IBaseContext,
        id: string
    ) => {
        const index = requests.findIndex((request) => request.customId === id);

        if (index !== -1) {
            requests.splice(index, 1);
        }
    };

    public getCollaborationRequestsByRecipientEmail = async (
        ctx: IBaseContext,
        emails: string[],
        blockId: string
    ) => {
        const emailMap = indexArray(emails, {
            indexer: (email) => email.toLowerCase(),
        });

        return requests.filter(
            (request) =>
                emailMap[request.to.email] && request.from.blockId === blockId
        );
    };

    public bulkSaveCollaborationRequests = async (
        ctx: IBaseContext,
        collaborationRequests: ICollaborationRequest[]
    ) => {
        collaborationRequests.forEach((request) => requests.push(request));
        return collaborationRequests;
    };

    public getCollaborationRequestsByBlockId = async (
        ctx: IBaseContext,
        blockId: string
    ) => {
        return requests.filter((request) => request.from.blockId === blockId);
    };

    public async saveCollaborationRequest(
        ctx: IBaseContext,
        collaborationRequest: Omit<ICollaborationRequest, "customId">
    ) {
        requests.push({
            ...collaborationRequest,
            customId: getNewId(),
        });

        return requests[requests.length - 1];
    }
}

export const getTestCollaborationRequestContext = makeSingletonFunc(
    () => new TestCollaborationRequestContext()
);
