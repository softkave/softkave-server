import { ITaskSprint } from '../../mongo/block/task';
import { IBoardSprintOptions, ISprint } from '../../mongo/sprint/definitions';
import { getDate, getDateStringIfExists } from '../../utilities/fns';
import { IBaseContext } from '../contexts/IBaseContext';
import { NotFoundError } from '../errors';
import { extractFields, getFields, publicWorkspaceResourceFields } from '../utils';
import { IPublicSprint, IPublicSprintOptions } from './types';

const publicSprintFields = getFields<IPublicSprint>({
  ...publicWorkspaceResourceFields,
  boardId: true,
  duration: true,
  name: true,
  sprintIndex: true,
  prevSprintId: true,
  nextSprintId: true,
  startDate: getDateStringIfExists,
  startedBy: true,
  endDate: getDateStringIfExists,
  endedBy: true,
});

const sprintOptionsFields = getFields<IPublicSprintOptions>({
  duration: true,
  updatedAt: true,
  updatedBy: true,
  createdAt: true,
  createdBy: true,
});

export function getPublicSprintData(sprint: ISprint): IPublicSprint {
  return extractFields(sprint, publicSprintFields);
}

export function getPublicSprintArray(sprints: ISprint[]): IPublicSprint[] {
  return sprints.map(sprint => extractFields(sprint, publicSprintFields));
}

export function getPublicSprintOptions(sprintOption: IBoardSprintOptions): IPublicSprintOptions {
  return extractFields(sprintOption, sprintOptionsFields);
}

export function assertSprint(sprint?: ISprint | null): asserts sprint {
  if (!sprint) {
    throw new NotFoundError('Sprint not found');
  }
}

export async function updateTaskSprintsUsingSprintId(
  ctx: IBaseContext,
  userId: string,
  sprintId: string,
  update: ITaskSprint | null
) {
  await ctx.data.task.updateManyByQuery(
    ctx,
    {taskSprint: {$objMatch: {sprintId}}},
    {taskSprint: update, lastUpdatedAt: getDate(), lastUpdatedBy: userId}
  );
}
