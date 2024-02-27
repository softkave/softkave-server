import {SystemResourceType} from '../../models/system';
import {ICollaborationRequest} from '../../mongo/collaboration-request/definitions';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import {getNewId02} from '../../utilities/ids';
import {CollaborationRequestDoesNotExistError} from '../collaborationRequests/errors';
import {saveNewItemToDb} from '../utils';
import {IBaseContext} from './IBaseContext';
import {getMongoFullTextRegex} from './utils';

export interface ICollaborationRequestContext {
  getCollaborationRequestById: (
    ctx: IBaseContext,
    id: string
  ) => Promise<ICollaborationRequest | null>;
  assertGetCollaborationRequestById: (
    ctx: IBaseContext,
    id: string
  ) => Promise<ICollaborationRequest>;
  getUserCollaborationRequests: (
    ctx: IBaseContext,
    email: string
  ) => Promise<ICollaborationRequest[]>;
  updateCollaborationRequestById: (
    ctx: IBaseContext,
    customId: string,
    data: Partial<ICollaborationRequest>
  ) => Promise<ICollaborationRequest | null>;
  deleteCollaborationRequestById: (ctx: IBaseContext, customId: string) => Promise<void>;
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
    collaborationRequest: Omit<ICollaborationRequest, 'customId'>
  ) => Promise<ICollaborationRequest>;
}

export default class CollaborationRequestContext implements ICollaborationRequestContext {
  getCollaborationRequestById = async (ctx: IBaseContext, id: string) => {
    return ctx.models.collaborationRequest.model.findOne({customId: id}).lean().exec();
  };

  assertGetCollaborationRequestById = async (ctx: IBaseContext, id: string) => {
    const request = await ctx.collaborationRequest.getCollaborationRequestById(ctx, id);
    if (!request) {
      throw new CollaborationRequestDoesNotExistError();
    }

    return request;
  };

  updateCollaborationRequestById = (
    ctx: IBaseContext,
    customId: string,
    data: Partial<ICollaborationRequest>
  ) => {
    return ctx.models.collaborationRequest.model
      .findOneAndUpdate({customId}, data, {new: true})
      .lean()
      .exec();
  };

  getUserCollaborationRequests = (ctx: IBaseContext, email: string) => {
    return ctx.models.collaborationRequest.model
      .find({
        'to.email': email,
      })
      .lean()
      .exec();
  };

  deleteCollaborationRequestById = async (ctx: IBaseContext, id: string) => {
    await ctx.models.collaborationRequest.model.deleteOne({customId: id}).exec();
  };

  getCollaborationRequestsByRecipientEmail = (
    ctx: IBaseContext,
    emails: string[],
    blockId: string
  ) => {
    return ctx.models.collaborationRequest.model
      .find({
        'to.email': {
          $in: emails.map(getMongoFullTextRegex),
        },
        'from.workspaceId': blockId,
      })
      .lean()
      .exec();
  };

  changeRequestsRecipientEmail = async (ctx: IBaseContext, fromEmail: string, toEmail: string) => {
    await ctx.models.collaborationRequest.model
      .updateMany(
        {'to.email': getMongoFullTextRegex(fromEmail)},
        {$set: {'to.email': toEmail.toLowerCase()}}
      )
      .exec();
  };

  bulkSaveCollaborationRequests = (
    ctx: IBaseContext,
    collaborationRequests: ICollaborationRequest[]
  ) => {
    return ctx.models.collaborationRequest.model.insertMany(collaborationRequests);
  };

  getCollaborationRequestsByBlockId = (ctx: IBaseContext, blockId: string) => {
    return ctx.models.collaborationRequest.model
      .find({
        'from.workspaceId': blockId,
      })
      .lean()
      .exec();
  };

  async saveCollaborationRequest(
    ctx: IBaseContext,
    collaborationRequest: Omit<ICollaborationRequest, 'customId'>
  ) {
    const collaborationRequestDoc = new ctx.models.collaborationRequest.model(collaborationRequest);

    return saveNewItemToDb(() => {
      collaborationRequestDoc.customId = getNewId02(SystemResourceType.CollaborationRequest);
      collaborationRequestDoc.save();
      return collaborationRequestDoc;
    });
  }
}

export const getCollaborationRequestContext = makeSingletonFn(
  () => new CollaborationRequestContext()
);
