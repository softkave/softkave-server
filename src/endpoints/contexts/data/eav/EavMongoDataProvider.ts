import {IEav} from '../../../../mongo/eav/eav';
import {IContextMongoDbModels} from '../../types';
import {BaseMongoDataProvider} from '../utils';
import {IEavDataProvider} from './type';

export class EavMongoDataProvider extends BaseMongoDataProvider<IEav> implements IEavDataProvider {
  mongoModelName: keyof IContextMongoDbModels = 'eav';
}
