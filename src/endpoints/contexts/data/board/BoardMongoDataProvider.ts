import {IBoard} from '../../../../mongo/block/board';
import {IContextMongoDbModels} from '../../types';
import {BaseMongoDataProvider} from '../utils';
import {IBoardDataProvider} from './type';

export class BoardMongoDataProvider
  extends BaseMongoDataProvider<IBoard>
  implements IBoardDataProvider
{
  mongoModelName: keyof IContextMongoDbModels = 'board';
}
