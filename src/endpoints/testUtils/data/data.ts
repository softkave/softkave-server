import {faker} from '@faker-js/faker';
import {Chance} from 'chance';
import {SystemResourceType} from '../../../models/system';
import {
  SoftkavePermissionActions,
  softkaveActionsList,
} from '../../../mongo/access-control/permissionItem';

const testUser00 = {
  name: 'Abayomi Akintomide',
  email: 'test-user-00@softkave.com',
  color: '#ffa39e',
  password: 'test-user-00!',
};

export const testData = {testUser00};
export const chance = new Chance();

export function randomAction(): SoftkavePermissionActions {
  return faker.helpers.arrayElement(softkaveActionsList) as SoftkavePermissionActions;
}

export function randomResourceType() {
  return faker.helpers.arrayElement(Object.values(SystemResourceType));
}
