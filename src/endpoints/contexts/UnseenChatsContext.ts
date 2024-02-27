import * as moment from 'moment';
import {SystemResourceType} from '../../models/system';
import {IUnseenChats} from '../../mongo/unseen-chats/definitions';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import {getDateString} from '../../utilities/fns';
import {getNewId02} from '../../utilities/ids';
import {IBaseContext} from './IBaseContext';

export interface IUnseenChatsContext {
  addEntry: (ctx: IBaseContext, userId: string, roomId: string) => Promise<IUnseenChats>;
  removeEntry: (ctx: IBaseContext, userId: string) => Promise<void>;
  consume: (ctx: IBaseContext, count?: number, fromDate?: string) => Promise<IUnseenChats[]>;
}

export default class UnseenChatsContext implements IUnseenChatsContext {
  addEntry = async (ctx: IBaseContext, userId: string, roomId: string) => {
    let data: IUnseenChats | null = await ctx.models.unseenChats.model
      .findOne({
        userId,
      })
      .lean()
      .exec();

    if (!data) {
      data = {
        userId,
        rooms: {},
        createdAt: getDateString(),
        customId: getNewId02(SystemResourceType.UnseenChats),
      };
    }

    data.rooms[roomId] = (data.rooms[roomId] || 0) + 1;
    await ctx.models.unseenChats.model.updateOne({userId}, data, {
      upsert: true,
    });

    return data;
  };

  removeEntry = async (ctx: IBaseContext, userId: string) => {
    await ctx.models.unseenChats.model
      .deleteMany({
        userId,
      })
      .exec();
  };

  consume = async (
    ctx: IBaseContext,
    count = 100,
    fromDate: string = moment().subtract(1, 'days').toISOString()
  ) => {
    const data = await ctx.models.unseenChats.model
      .find({createdAt: {$gte: fromDate}}, {count})
      .lean()
      .exec();

    if (data.length > 0) {
      const ids = data.map(item => item.customId);
      await ctx.models.unseenChats.model.deleteMany({customId: {$in: ids}}).exec();
    }

    return data;
  };
}

export const getUnseenChatsContext = makeSingletonFn(() => new UnseenChatsContext());
