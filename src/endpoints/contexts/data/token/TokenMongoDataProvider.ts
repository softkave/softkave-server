import {IToken} from '../../../../mongo/token/definitions';
import {IContextMongoDbModels} from '../../types';
import {BaseMongoDataProvider} from '../utils';
import {ITokenDataProvider} from './type';

export class TokenMongoDataProvider
  extends BaseMongoDataProvider<IToken>
  implements ITokenDataProvider
{
  mongoModelName: keyof IContextMongoDbModels = 'token';
}
