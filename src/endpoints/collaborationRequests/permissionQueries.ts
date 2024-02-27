import {SystemResourceType} from '../../models/system';
import {
  AuthPermissionQueries,
  makeSortByTargetSortFn,
} from '../contexts/authorization-checks/utils';

export function getReadOrgRequestsPermQueries(orgId: string) {
  const qContainers = AuthPermissionQueries.start('read-request')
    .withContainerId(orgId, SystemResourceType.CollaborationRequest)
    .getQueries();
  const qTargets = AuthPermissionQueries.start('read-request').withTargetId(orgId).getQueries();
  return {qContainers, qTargets};
}

export function getCreateRequestPermQueries(orgId: string) {
  const qTargets = AuthPermissionQueries.start('invite-collaborator')
    .withTargetId(orgId)
    .getQueries();
  return {qTargets};
}

export function getUpdateRequestPermQueries(orgId: string, requestId: string) {
  const qTargets = AuthPermissionQueries.start('update-request')
    .withTargetId(orgId)
    .withTargetId(requestId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([requestId, orgId]);
  return {qTargets, sortFn};
}

export function getRevokeRequestPermQueries(orgId: string, requestId: string) {
  const qTargets = AuthPermissionQueries.start('revoke-request')
    .withTargetId(orgId)
    .withTargetId(requestId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([requestId, orgId]);
  return {qTargets, sortFn};
}
