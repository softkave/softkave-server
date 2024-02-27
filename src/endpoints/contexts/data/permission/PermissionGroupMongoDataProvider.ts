import {IPermissionGroup} from '../../../../mongo/access-control/permissionGroup';
import {IContextMongoDbModels} from '../../types';
import {BaseMongoDataProvider} from '../utils';
import {IPermissionGroupDataProvider} from './type';

export class PermissionGroupMongoDataProvider
  extends BaseMongoDataProvider<IPermissionGroup>
  implements IPermissionGroupDataProvider
{
  mongoModelName: keyof IContextMongoDbModels = 'permissionGroup';
}
