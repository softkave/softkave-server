import { ICollaborationRequest } from "../../../mongo/collaboration-request";
import makeSingletonFn from "../../../utilities/createSingletonFunc";
import { indexArray } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { ICollaborationRequestContext } from "../../contexts/CollaborationRequestContext";
import { IBaseContext } from "../../contexts/IBaseContext";
import { CollaborationRequestDoesNotExistError } from "../../user/errors";

class TestCollaborationRequestContext implements ICollaborationRequestContext {
    requests: ICollaborationRequest[] = [];

    public getCollaborationRequestById = async (
        ctx: IBaseContext,
        id: string
    ) => {
        return this.requests.find((request) => request.customId === id);
    };

    assertGetCollaborationRequestById = async (
        ctx: IBaseContext,
        id: string
    ) => {
        const request =
            await ctx.collaborationRequest.getCollaborationRequestById(ctx, id);

        if (!request) {
            throw new CollaborationRequestDoesNotExistError();
        }

        return request;
    };

    public updateCollaborationRequestById = async (
        ctx: IBaseContext,
        customId: string,
        data: Partial<ICollaborationRequest>
    ) => {
        const index = this.requests.findIndex(
            (request) => request.customId === customId
        );

        if (index !== -1) {
            this.requests[index] = { ...this.requests[index], ...data };
            return this.requests[index];
        }
    };

    public getUserCollaborationRequests = async (
        ctx: IBaseContext,
        email: string
    ) => {
        email = email.toLowerCase();
        return this.requests.filter((request) => request.to.email === email);
    };

    public deleteCollaborationRequestById = async (
        ctx: IBaseContext,
        id: string
    ) => {
        const index = this.requests.findIndex(
            (request) => request.customId === id
        );

        if (index !== -1) {
            this.requests.splice(index, 1);
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

        return this.requests.filter(
            (request) =>
                emailMap[request.to.email] && request.from.blockId === blockId
        );
    };

    public bulkSaveCollaborationRequests = async (
        ctx: IBaseContext,
        collaborationRequests: ICollaborationRequest[]
    ) => {
        collaborationRequests.forEach((request) => this.requests.push(request));
        return collaborationRequests;
    };

    public getCollaborationRequestsByBlockId = async (
        ctx: IBaseContext,
        blockId: string
    ) => {
        return this.requests.filter(
            (request) => request.from.blockId === blockId
        );
    };

    public async saveCollaborationRequest(
        ctx: IBaseContext,
        collaborationRequest: Omit<ICollaborationRequest, "customId">
    ) {
        this.requests.push({
            ...collaborationRequest,
            customId: getNewId(),
        });

        return this.requests[this.requests.length - 1];
    }
}

export const getTestCollaborationRequestContext = makeSingletonFn(
    () => new TestCollaborationRequestContext()
);
