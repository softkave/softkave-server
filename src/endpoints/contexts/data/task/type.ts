import {ITask} from '../../../../mongo/block/task';
import {DataQuery, IBaseDataProvider} from '../types';

export type ITaskQuery = DataQuery<ITask>;
export type ITaskDataProvider = IBaseDataProvider<ITask>;
