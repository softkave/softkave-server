import {IUser} from '../../../../mongo/user/definitions';
import {IContextMongoDbModels} from '../../types';
import {BaseMongoDataProvider} from '../utils';
import {IUserDataProvider} from './types';

export class UserMongoDataProvider
  extends BaseMongoDataProvider<IUser>
  implements IUserDataProvider
{
  mongoModelName: keyof IContextMongoDbModels = 'user';
}
