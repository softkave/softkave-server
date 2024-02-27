import {AuthPermissionQueries} from '../contexts/authorization-checks/utils';

export function getReadOrgPermQueries(orgId: string) {
  const qTargets = AuthPermissionQueries.start('read-org').withTargetId(orgId).getQueries();
  return {qTargets};
}

export function getUpdateOrgPermQueries(orgId: string) {
  const qTargets = AuthPermissionQueries.start('update-org').withTargetId(orgId).getQueries();
  return {qTargets};
}
