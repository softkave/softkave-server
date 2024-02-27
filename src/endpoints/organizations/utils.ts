import {IWorkspace} from '../../mongo/block/workspace';
import {extractFields, getFields, publicWorkspaceResourceFields} from '../utils';
import {OrganizationDoesNotExistError} from './errors';
import {IPublicOrganization} from './types';

const publicOrganizationFields = getFields<IPublicOrganization>({
  ...publicWorkspaceResourceFields,
  name: true,
  description: true,
  color: true,
  publicPermissionGroupId: true,
});

export function getPublicOrganizationData(organization: Partial<IWorkspace>): IPublicOrganization {
  return extractFields(organization, publicOrganizationFields);
}

export function getPublicOrganizationsArray(
  organizations: Array<Partial<IWorkspace>>
): IPublicOrganization[] {
  return organizations.map(organization => extractFields(organization, publicOrganizationFields));
}

export function throwOrganizationNotFoundError() {
  throw new OrganizationDoesNotExistError();
}

export function assertOrganization(org?: IWorkspace | null): asserts org {
  if (!org) {
    throwOrganizationNotFoundError();
  }
}
