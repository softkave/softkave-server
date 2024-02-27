import {Express} from 'express';
import {IBaseContext} from '../contexts/IBaseContext';
import {wrapEndpointREST} from '../utils';
import {assignPermissionGroupsEndpoint} from './assignPermissionGroups/handler';
import createPermissionGroup from './createPermissionGroup/handler';
import createPermissionItems from './createPermissionItems/handler';
import deletePermissionGroups from './deletePermissionGroups/handler';
import deletePermissionItems from './deletePermissionItems/handler';
import {getAssignedPermissionGroupListEndpoint} from './getAssignedPermissionGroupList/handler';
import getPermissionGroupList from './getContainerPermissionGroupList/handler';
import {getPermissionGroupAssigneesEndpoint} from './getPermissionGroupAssignees/handler';
import getPermissionItemList from './getPermissionItemList/handler';
import {unassignPermissionGroupsEndpoint} from './unassignFromPermissionGroups/handler';
import updatePermissionGroup from './updatePermissionGroup/handler';

const baseURL = '/api/permissions';

export default function setupPermissionsRESTEndpoints(ctx: IBaseContext, app: Express) {
  const endpoints = {
    assignPermissionGroups: wrapEndpointREST(assignPermissionGroupsEndpoint, ctx),
    unassignFromPermissionGroups: wrapEndpointREST(unassignPermissionGroupsEndpoint, ctx),
    getAssignedPermissionGroupList: wrapEndpointREST(getAssignedPermissionGroupListEndpoint, ctx),
    getPermissionGroupAssigneeList: wrapEndpointREST(getPermissionGroupAssigneesEndpoint, ctx),
    getPermissionGroupList: wrapEndpointREST(getPermissionGroupList, ctx),
    createPermissionGroup: wrapEndpointREST(createPermissionGroup, ctx),
    updatePermissionGroup: wrapEndpointREST(updatePermissionGroup, ctx),
    deletePermissionGroups: wrapEndpointREST(deletePermissionGroups, ctx),

    getPermissionItemList: wrapEndpointREST(getPermissionItemList, ctx),
    createPermissionItems: wrapEndpointREST(createPermissionItems, ctx),
    deletePermissionItems: wrapEndpointREST(deletePermissionItems, ctx),
  };

  app.post(`${baseURL}/assignPermissionGroups`, endpoints.assignPermissionGroups);
  app.post(`${baseURL}/getAssignedPermissionGroupList`, endpoints.getAssignedPermissionGroupList);
  app.post(`${baseURL}/getPermissionGroupAssigneeList`, endpoints.getPermissionGroupAssigneeList);
  app.post(`${baseURL}/getPermissionGroupList`, endpoints.getPermissionGroupList);
  app.post(`${baseURL}/unassignFromPermissionGroups`, endpoints.unassignFromPermissionGroups);
  app.post(`${baseURL}/createPermissionGroup`, endpoints.createPermissionGroup);
  app.post(`${baseURL}/updatePermissionGroup`, endpoints.updatePermissionGroup);
  app.post(`${baseURL}/deletePermissionGroups`, endpoints.deletePermissionGroups);

  app.post(`${baseURL}/getPermissionItemList`, endpoints.getPermissionItemList);
  app.post(`${baseURL}/createPermissionItems`, endpoints.createPermissionItems);
  app.post(`${baseURL}/deletePermissionItems`, endpoints.deletePermissionItems);
}
