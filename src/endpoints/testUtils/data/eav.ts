import {faker} from '@faker-js/faker';
import {defaultTo} from 'lodash';
import {SystemResourceType} from '../../../models/system';
import {EavAttributes, IEav, IEavAssignedPermissionGroup} from '../../../mongo/eav/eav';
import {getDate} from '../../../utilities/fns';
import {getNewId02} from '../../../utilities/ids';
import {PartialDepth} from '../../../utilities/types';
import {randomResourceType} from './data';

export function randomEavAttribute() {
  return faker.helpers.arrayElement(Object.values(EavAttributes));
}

export function seedEav<T extends IEav = IEav>(count: number, partial: Partial<T> = {}) {
  const p: IEav[] = [];
  for (let i = 0; i < count; i++) {
    const id = getNewId02(SystemResourceType.Eav);
    p.push({
      customId: id,
      organizationId: id,
      createdAt: getDate(),
      createdBy: id,
      attribute: randomEavAttribute(),
      entityId: id,
      entityType: randomResourceType(),
      value: {},
      ...partial,
    });
  }
  return p as T[];
}

export function seedEavAssignedPermissionGroups(
  count: number,
  partial: PartialDepth<IEavAssignedPermissionGroup> = {}
): IEavAssignedPermissionGroup[] {
  const id = getNewId02(SystemResourceType.Eav);
  const entityType = randomResourceType();
  return seedEav<IEavAssignedPermissionGroup>(count, {
    ...partial,
    value: {
      assignedAt: getDate(),
      assignedBy: id,
      containerId: id,
      entityType,
      containerType: randomResourceType(),
      entityId: getNewId02(entityType),
      order: faker.datatype.number(),
      permissionGroupId: id,
      ...defaultTo(partial.value, {}),
    },
  });
}
