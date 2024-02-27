import * as qs from 'qs';

export enum NotificationLinkDestinations {
  OrganizationChats = 'organizationChats',
}

export interface IDestinationParamsBase {
  dest: NotificationLinkDestinations;
}

export interface IWorkspaceChatsDestinationParams extends IDestinationParamsBase {
  orgId: string;
}

export function makeLinkURL<T extends IDestinationParamsBase>(baseURL: string, data: T) {
  return `${baseURL}?${qs.stringify(data)}`;
}
