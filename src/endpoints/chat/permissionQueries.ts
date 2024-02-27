import {
  AuthPermissionQueries,
  makeSortByTargetSortFn,
} from '../contexts/authorization-checks/utils';

export function getCreateChatPermQueries(orgId: string) {
  const qTarget = AuthPermissionQueries.start('chat').withTargetId(orgId).getQueries();
  return {qTarget};
}

export function getReadChatRoomPermQueries(orgId: string, roomId: string) {
  const qTarget = AuthPermissionQueries.start('chat')
    .withTargetId(orgId)
    .withTargetId(roomId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([roomId, orgId]);
  return {qTarget, sortFn};
}
