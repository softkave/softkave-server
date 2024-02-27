import {ITask} from '../../../../mongo/block/task';
import {IContextMongoDbModels} from '../../types';
import {BaseMongoDataProvider} from '../utils';
import {ITaskDataProvider} from './type';

export class TaskMongoDataProvider
  extends BaseMongoDataProvider<ITask>
  implements ITaskDataProvider
{
  mongoModelName: keyof IContextMongoDbModels = 'task';
}
