import {SystemResourceType} from '../../../models/system';
import {
  IPermissionItem,
  SoftkavePermissionActions,
} from '../../../mongo/access-control/permissionItem';
import {indexArray} from '../../../utilities/fns';
import {IPermissionItemQuery} from '../data/permission/type';

export function makeSortByTargetSortFn(targetIdList: string[]) {
  const tMap = indexArray(targetIdList, {reducer: (c, arr, i) => i});
  return (item01: IPermissionItem, item02: IPermissionItem) =>
    (tMap[item01.target.targetId] ?? 0) - (tMap[item02.target.targetId] ?? 0);
}
export function makeSortByEntitySortFn(entityIdList: string[]) {
  const eMap = indexArray(entityIdList, {reducer: (c, arr, i) => i});
  return (item01: IPermissionItem, item02: IPermissionItem) =>
    (eMap[item01.entity.entityId] ?? 0) - (eMap[item02.entity.entityId] ?? 0);
}

export class AuthPermissionQueries {
  static start(action: SoftkavePermissionActions) {
    return new AuthPermissionQueries(action);
  }

  queries: IPermissionItemQuery[] = [];
  constructor(public action: SoftkavePermissionActions) {}

  withContainerId(containerId: string, targetType: SystemResourceType) {
    this.queries.push({
      target: {$objMatch: {containerId, targetType}},
      action: this.action,
    });
    return this;
  }

  withTargetId(targetId: string) {
    this.queries.push({
      target: {$objMatch: {targetId}},
      action: this.action,
    });
    return this;
  }

  getQueries() {
    return this.queries;
  }
}
