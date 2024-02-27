import {IWorkspace} from '../../../../mongo/block/workspace';
import {IContextMongoDbModels} from '../../types';
import {BaseMongoDataProvider} from '../utils';
import {IWorkspaceDataProvider} from './type';

export class WorkspaceMongoDataProvider
  extends BaseMongoDataProvider<IWorkspace>
  implements IWorkspaceDataProvider
{
  mongoModelName: keyof IContextMongoDbModels = 'workspace';
}
