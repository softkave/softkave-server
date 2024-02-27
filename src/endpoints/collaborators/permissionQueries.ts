import {SystemResourceType} from '../../models/system';
import {
  AuthPermissionQueries,
  makeSortByTargetSortFn,
} from '../contexts/authorization-checks/utils';

export function getReadCollaboratorsPermQueries(orgId: string) {
  const qContainers = AuthPermissionQueries.start('read-collaborator')
    .withContainerId(orgId, SystemResourceType.User)
    .getQueries();
  const qTargets = AuthPermissionQueries.start('read-collaborator')
    .withTargetId(orgId)
    .getQueries();
  return {qContainers, qTargets};
}

export function getRemoveCollaboratorPermQueries(orgId: string, userId: string) {
  const qTargets = AuthPermissionQueries.start('remove-collaborator')
    .withTargetId(orgId)
    .withTargetId(userId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([userId, orgId]);
  return {qTargets, sortFn};
}
