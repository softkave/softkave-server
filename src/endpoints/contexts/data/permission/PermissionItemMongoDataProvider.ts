import {IPermissionItem} from '../../../../mongo/access-control/permissionItem';
import {IContextMongoDbModels} from '../../types';
import {BaseMongoDataProvider} from '../utils';
import {IPermissionItemDataProvider} from './type';

export class PermissionItemMongoDataProvider
  extends BaseMongoDataProvider<IPermissionItem>
  implements IPermissionItemDataProvider
{
  mongoModelName: keyof IContextMongoDbModels = 'permissionItem';
}
