import {SystemActionType, SystemResourceType} from '../../models/system';

export interface IRoomOpInput {
  type: SystemResourceType;
  customId: string;
  action?: SystemActionType.Read;
  subRoom?: SystemResourceType.Sprint | SystemResourceType.Task;
}
