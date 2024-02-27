import uuid = require('uuid');
import {
  resourceTypeShortNameMaxLen,
  resourceTypeShortNames,
  shortNameToResourceTypeMap,
  SystemResourceType,
} from '../models/system';
import {InvalidInputError} from './errors';
import {assertArg} from './fns';

export function getNewId() {
  return uuid.v4();
}

export const kIdSeperator = '_';

export function getNewId02(resourceType: SystemResourceType) {
  return `${resourceTypeShortNames[resourceType]}${kIdSeperator}${uuid.v4()}`;
}

export function tryGetResourceTypeFromId(id: string): SystemResourceType | undefined {
  const shortName = id.slice(0, resourceTypeShortNameMaxLen);
  const type = shortNameToResourceTypeMap[shortName];
  return type;
}

export function getResourceTypeFromId(id: string) {
  const type = tryGetResourceTypeFromId(id);
  assertArg(type, new InvalidInputError('Provided ID is invalid'));
  return type;
}

export function isRegularUserId(id: string) {
  return tryGetResourceTypeFromId(id) !== SystemResourceType.AnonymousUser;
}

export function isAnonymousUserId(id: string) {
  return tryGetResourceTypeFromId(id) === SystemResourceType.AnonymousUser;
}

export function getUserType(id: string) {
  return isAnonymousUserId(id) ? SystemResourceType.AnonymousUser : SystemResourceType.User;
}
