import {IUser} from '../../../../mongo/user/definitions';
import {IContextMongoDbModels} from '../../types';
import {BaseMongoDataProvider} from '../utils';
import {IAnonymousUserDataProvider} from './types';

export class AnonymousUserMongoDataProvider
  extends BaseMongoDataProvider<IUser>
  implements IAnonymousUserDataProvider
{
  mongoModelName: keyof IContextMongoDbModels = 'anonymousUser';
}
