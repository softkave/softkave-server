import { ICollaborationRequest } from "../../mongo/collaboration-request";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import getNewId from "../../utilities/getNewId";
import { CollaborationRequestDoesNotExistError } from "../collaborationRequest/errors";
import { saveNewItemToDb, wrapFireAndThrowError } from "../utils";
import { IBaseContext } from "./BaseContext";

export interface ICollaborationRequestContext {
    getCollaborationRequestById: (
        ctx: IBaseContext,
        id: string
    ) => Promise<ICollaborationRequest | undefined>;
    assertGetCollaborationRequestById: (
        ctx: IBaseContext,
        id: string
    ) => Promise<ICollaborationRequest>;
    getUserCollaborationRequests: (
        ctx: IBaseContext,
        email: string
    ) => Promise<ICollaborationRequest[] | undefined>;
    updateCollaborationRequestById: (
        ctx: IBaseContext,
        customId: string,
        data: Partial<ICollaborationRequest>
    ) => Promise<ICollaborationRequest | undefined>;
    deleteCollaborationRequestById: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<void>;
    getCollaborationRequestsByRecipientEmail: (
        ctx: IBaseContext,
        emails: string[],
        blockId: string
    ) => Promise<ICollaborationRequest[]>;
    bulkSaveCollaborationRequests: (
        ctx: IBaseContext,
        collaborationRequests: ICollaborationRequest[]
    ) => Promise<ICollaborationRequest[]>;
    getCollaborationRequestsByBlockId: (
        ctx: IBaseContext,
        blockId: string
    ) => Promise<ICollaborationRequest[]>;
    saveCollaborationRequest: (
        ctx: IBaseContext,
        collaborationRequest: Omit<ICollaborationRequest, "customId">
    ) => Promise<ICollaborationRequest>;
}

export default class CollaborationRequestContext
    implements ICollaborationRequestContext
{
    public getCollaborationRequestById = wrapFireAndThrowError(
        (ctx: IBaseContext, id: string) => {
            return ctx.models.collaborationRequestModel.model
                .findOne({ customId: id })
                .lean()
                .exec();
        }
    );

    public assertGetCollaborationRequestById = wrapFireAndThrowError(
        async (ctx: IBaseContext, id: string) => {
            const request =
                await ctx.collaborationRequest.getCollaborationRequestById(
                    ctx,
                    id
                );

            if (!request) {
                throw new CollaborationRequestDoesNotExistError();
            }

            return request;
        }
    );

    public updateCollaborationRequestById = wrapFireAndThrowError(
        (
            ctx: IBaseContext,
            customId: string,
            data: Partial<ICollaborationRequest>
        ) => {
            return ctx.models.collaborationRequestModel.model
                .findOneAndUpdate({ customId }, data, { new: true })
                .lean()
                .exec();
        }
    );

    public getUserCollaborationRequests = wrapFireAndThrowError(
        (ctx: IBaseContext, email: string) => {
            return ctx.models.collaborationRequestModel.model
                .find({
                    "to.email": email,
                })
                .lean()
                .exec();
        }
    );

    public deleteCollaborationRequestById = wrapFireAndThrowError(
        async (ctx: IBaseContext, id: string) => {
            await ctx.models.collaborationRequestModel.model
                .deleteOne({ customId: id })
                .exec();
        }
    );

    public getCollaborationRequestsByRecipientEmail = wrapFireAndThrowError(
        (ctx: IBaseContext, emails: string[], blockId: string) => {
            return ctx.models.collaborationRequestModel.model
                .find({
                    "to.email": {
                        $in: emails,
                    },
                    "from.blockId": blockId,
                })
                .lean()
                .exec();
        }
    );

    public bulkSaveCollaborationRequests = wrapFireAndThrowError(
        (ctx: IBaseContext, collaborationRequests: ICollaborationRequest[]) => {
            return ctx.models.collaborationRequestModel.model.insertMany(
                collaborationRequests
            );
        }
    );

    public getCollaborationRequestsByBlockId = wrapFireAndThrowError(
        (ctx: IBaseContext, blockId: string) => {
            return ctx.models.collaborationRequestModel.model
                .find({
                    "from.blockId": blockId,
                })
                .lean()
                .exec();
        }
    );

    public async saveCollaborationRequest(
        ctx: IBaseContext,
        collaborationRequest: Omit<ICollaborationRequest, "customId">
    ) {
        const collaborationRequestDoc =
            new ctx.models.collaborationRequestModel.model(
                collaborationRequest
            );

        return saveNewItemToDb(() => {
            collaborationRequestDoc.customId = getNewId();
            collaborationRequestDoc.save();
            return collaborationRequestDoc;
        });
    }
}

export const getCollaborationRequestContext = makeSingletonFunc(
    () => new CollaborationRequestContext()
);
