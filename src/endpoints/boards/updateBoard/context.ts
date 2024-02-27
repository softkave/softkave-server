import {FilterQuery, UpdateQuery} from 'mongoose';
import {ITask} from '../../../mongo/block/task';
import {IUser} from '../../../mongo/user/definitions';
import {ServerError} from '../../../utilities/errors';
import {getDate} from '../../../utilities/fns';
import {IBaseContext} from '../../contexts/IBaseContext';
import {IUpdateBoardContext} from './types';

export function makeUpdateBoardContext(context: IBaseContext): IUpdateBoardContext {
  return {
    ...context,
    async bulkUpdateDeletedStatusInTasks(
      ctx: IBaseContext,
      parentId: string,
      items: Array<{oldId: string; newId: string}>,
      user: IUser
    ) {
      try {
        await ctx.models.task.model.bulkWrite(
          items.map(item => {
            const q: FilterQuery<ITask> = {
              boardId: parentId,
              status: item.oldId,
            };
            const update: Partial<ITask> = {
              status: item.newId,
              statusAssignedAt: getDate(),
              statusAssignedBy: user.customId,
            };
            return {
              updateMany: {
                update,
                filter: q,
              },
            };
          })
        );
      } catch (error) {
        console.error(error);
        throw new ServerError();
      }
    },

    async bulkUpdateDeletedResolutionsInTasks(ctx: IBaseContext, parentId: string, ids: string[]) {
      try {
        await ctx.models.task.model
          .updateMany(
            {
              boardId: parentId,
              taskResolution: {$in: ids},
            },
            {taskResolution: null}
          )
          .exec();
      } catch (error) {
        console.error(error);
        throw new ServerError();
      }
    },

    async bulkRemoveDeletedLabelsInTasks(ctx: IBaseContext, parentId: string, ids: string[]) {
      try {
        await ctx.models.board.model.bulkWrite(
          ids.map(id => {
            const q: FilterQuery<ITask> = {
              boardId: parentId,
              'labels.customId': id,
            };
            const u: UpdateQuery<ITask> = {
              $pull: {'labels.customId': id},
            };
            return {
              updateMany: {filter: q, update: u},
            };
          })
        );
      } catch (error) {
        console.error(error);

        // TODO: how can we return the right error here, like "error updating affected tasks"
        // instead of just server error?
        throw new ServerError();
      }
    },
  };
}
