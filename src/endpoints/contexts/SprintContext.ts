import {SystemResourceType} from '../../models/system';
import {ISprint} from '../../mongo/sprint/definitions';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import {getNewId02} from '../../utilities/ids';
import {IUpdateItemById} from '../../utilities/types';
import {saveNewItemToDb} from '../utils';
import {IBaseContext} from './IBaseContext';

export interface ISprintContext {
  saveSprint: (ctx: IBaseContext, sprint: Omit<ISprint, 'customId'>) => Promise<ISprint>;
  getSprintById: (ctx: IBaseContext, customId: string) => Promise<ISprint | null>;
  getMany: (ctx: IBaseContext, ids: string[]) => Promise<ISprint[]>;
  getSprintsByBoardId: (ctx: IBaseContext, boardId: string) => Promise<ISprint[]>;
  updateSprintById: (
    ctx: IBaseContext,
    customId: string,
    data: Partial<ISprint>
  ) => Promise<ISprint | null>;

  /**
   * Don't use to update array fields, cause it'll throw an error
   * about using atomic fields
   */
  bulkUpdateSprintsById: (
    ctx: IBaseContext,
    sprints: Array<IUpdateItemById<ISprint>>
  ) => Promise<void>;
  sprintExists: (ctx: IBaseContext, name: string, boardId: string) => Promise<boolean>;
  deleteSprint: (ctx: IBaseContext, sprintId: string) => Promise<void>;
  deleteSprintByBoardId: (ctx: IBaseContext, boardId: string) => Promise<void>;
  updateUnstartedSprints: (
    ctx: IBaseContext,
    boardId: string,
    data: Partial<ISprint>
  ) => Promise<void>;
}

export default class SprintContext implements ISprintContext {
  getSprintById = (ctx: IBaseContext, customId: string) => {
    return ctx.models.sprint.model.findOne({customId}).lean().exec();
  };

  getMany = (ctx: IBaseContext, ids: string[]) => {
    return ctx.models.sprint.model
      .find({customId: {$in: ids}})
      .lean()
      .exec();
  };

  updateSprintById = (ctx: IBaseContext, customId: string, data: Partial<ISprint>) => {
    return ctx.models.sprint.model.findOneAndUpdate({customId}, data, {new: true}).lean().exec();
  };

  bulkUpdateSprintsById = async (ctx: IBaseContext, data: Array<IUpdateItemById<ISprint>>) => {
    const opts = data.map(b => ({
      updateOne: {
        filter: {customId: b.id},
        update: b.data,
      },
    }));

    await ctx.models.sprint.model.bulkWrite(opts);
  };

  getSprintsByBoardId = (ctx: IBaseContext, boardId: string) => {
    return ctx.models.sprint.model.find({boardId}).lean().exec();
  };

  sprintExists = async (ctx: IBaseContext, name: string, boardId: string) => {
    const exists = await ctx.models.sprint.model.exists({
      boardId,
      name: new RegExp(`^${name}$`, 'i'),
    });
    return !!exists;
  };

  deleteSprint = async (ctx: IBaseContext, sprintId: string) => {
    await ctx.models.sprint.model.deleteOne({customId: sprintId}).exec();
  };

  deleteSprintByBoardId = async (ctx: IBaseContext, boardId: string) => {
    await ctx.models.sprint.model.deleteOne({boardId}).exec();
  };

  updateUnstartedSprints = async (ctx: IBaseContext, boardId: string, data: Partial<ISprint>) => {
    await ctx.models.sprint.model.updateMany({boardId, startDate: null}, data).exec();
  };

  async saveSprint(ctx: IBaseContext, sprint: Omit<ISprint, 'customId'>) {
    const sprintDoc = new ctx.models.sprint.model(sprint);
    return saveNewItemToDb(async () => {
      sprintDoc.customId = getNewId02(SystemResourceType.Sprint);
      await sprintDoc.save();
      return sprintDoc;
    });
  }
}

export const getSprintContext = makeSingletonFn(() => new SprintContext());
