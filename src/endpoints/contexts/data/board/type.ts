import {IBoard} from '../../../../mongo/block/board';
import {DataQuery, IBaseDataProvider} from '../types';

export type IBoardQuery = DataQuery<IBoard>;
export type IBoardDataProvider = IBaseDataProvider<IBoard>;
