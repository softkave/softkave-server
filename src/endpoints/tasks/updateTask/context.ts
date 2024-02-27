import {IBoard} from '../../../mongo/block/board';
import {IUser} from '../../../mongo/user/definitions';
import {IBaseContext} from '../../contexts/IBaseContext';
import transferTask from '../transferTask/handler';
import sendAssignedTaskEmailNotification from './sendAssignedTaskEmailNotification';
import {IUpdateTaskContext} from './types';

export function makeUpdateTaskContext(context: IBaseContext): IUpdateTaskContext {
  return {
    ...context,
    async transferTask(context, instData) {
      return await transferTask(context, instData);
    },

    async sendAssignedTaskEmailNotification(
      ctx: IBaseContext,
      board: IBoard,
      taskName: string,
      taskDescription: string,
      assigner: IUser,
      assignee: IUser
    ) {
      return sendAssignedTaskEmailNotification(ctx, {
        taskName,
        taskDescription,
        email: assignee.email,
        board: board.name,
        assignee: assignee.firstName,
        assigner: assigner.firstName,
        loginLink: ctx.appVariables.loginPath,
      });
    },
  };
}
