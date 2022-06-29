import { ICollaborationRequest } from "../../mongo/collaboration-request";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import getNewId from "../../utilities/getNewId";
import { CollaborationRequestDoesNotExistError } from "../collaborationRequests/errors";
import { saveNewItemToDb, wrapFireAndThrowErrorAsync } from "../utils";
import { IBaseContext } from "./IBaseContext";
import { getMongoFullTextRegex } from "./utils";

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
  changeRequestsRecipientEmail: (
    ctx: IBaseContext,
    fromEmail: string,
    toEmail: string
  ) => Promise<void>;
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
  public getCollaborationRequestById = wrapFireAndThrowErrorAsync(
    (ctx: IBaseContext, id: string) => {
      return ctx.models.collaborationRequestModel.model
        .findOne({ customId: id })
        .lean()
        .exec();
    }
  );

  public assertGetCollaborationRequestById = wrapFireAndThrowErrorAsync(
    async (ctx: IBaseContext, id: string) => {
      const request =
        await ctx.collaborationRequest.getCollaborationRequestById(ctx, id);

      if (!request) {
        throw new CollaborationRequestDoesNotExistError();
      }

      return request;
    }
  );

  public updateCollaborationRequestById = wrapFireAndThrowErrorAsync(
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

  public getUserCollaborationRequests = wrapFireAndThrowErrorAsync(
    (ctx: IBaseContext, email: string) => {
      return ctx.models.collaborationRequestModel.model
        .find({
          "to.email": email,
        })
        .lean()
        .exec();
    }
  );

  public deleteCollaborationRequestById = wrapFireAndThrowErrorAsync(
    async (ctx: IBaseContext, id: string) => {
      await ctx.models.collaborationRequestModel.model
        .deleteOne({ customId: id })
        .exec();
    }
  );

  public getCollaborationRequestsByRecipientEmail = wrapFireAndThrowErrorAsync(
    (ctx: IBaseContext, emails: string[], blockId: string) => {
      return ctx.models.collaborationRequestModel.model
        .find({
          "to.email": {
            $in: emails.map(getMongoFullTextRegex),
          },
          "from.blockId": blockId,
        })
        .lean()
        .exec();
    }
  );

  public changeRequestsRecipientEmail = wrapFireAndThrowErrorAsync(
    async (ctx: IBaseContext, fromEmail: string, toEmail: string) => {
      await ctx.models.collaborationRequestModel.model
        .updateMany(
          { "to.email": getMongoFullTextRegex(fromEmail) },
          { $set: { "to.email": toEmail.toLowerCase() } }
        )
        .exec();
    }
  );

  public bulkSaveCollaborationRequests = wrapFireAndThrowErrorAsync(
    (ctx: IBaseContext, collaborationRequests: ICollaborationRequest[]) => {
      return ctx.models.collaborationRequestModel.model.insertMany(
        collaborationRequests
      );
    }
  );

  public getCollaborationRequestsByBlockId = wrapFireAndThrowErrorAsync(
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
      new ctx.models.collaborationRequestModel.model(collaborationRequest);

    return saveNewItemToDb(() => {
      collaborationRequestDoc.customId = getNewId();
      collaborationRequestDoc.save();
      return collaborationRequestDoc;
    });
  }
}

export const getCollaborationRequestContext = makeSingletonFn(
  () => new CollaborationRequestContext()
);
