import {wrapEndpointREST} from '../utils';
import {Express} from 'express';
import {IBaseContext} from '../contexts/IBaseContext';
import addCollaborators from './addCollaborators/handler';
import getOrganizationRequests from './getOrganizationRequests/handler';
import getUserRequests from './getUserRequests/handler';
import markRequestRead from './markRequestRead/handler';
import respondToRequest from './respondToRequest/handler';
import revokeRequest from './revokeRequest/handler';
import {makeAddCollaboratorContext} from './addCollaborators/context';
import {makeRevokeRequestContext} from './revokeRequest/context';

const baseURL = '/api/collaborationRequests';

export default function setupCollaborationRequestsRESTEndpoints(ctx: IBaseContext, app: Express) {
  const endpoints = {
    addCollaborators: wrapEndpointREST(addCollaborators, makeAddCollaboratorContext(ctx)),
    getOrganizationRequests: wrapEndpointREST(getOrganizationRequests, ctx),
    getUserRequests: wrapEndpointREST(getUserRequests, ctx),
    markRequestRead: wrapEndpointREST(markRequestRead, ctx),
    respondToRequest: wrapEndpointREST(respondToRequest, ctx),
    revokeRequest: wrapEndpointREST(revokeRequest, makeRevokeRequestContext(ctx)),
  };

  app.post(`${baseURL}/addCollaborators`, endpoints.addCollaborators);
  app.post(`${baseURL}/getOrganizationRequests`, endpoints.getOrganizationRequests);
  app.post(`${baseURL}/getUserRequests`, endpoints.getUserRequests);
  app.post(`${baseURL}/markRequestRead`, endpoints.markRequestRead);
  app.post(`${baseURL}/respondToRequest`, endpoints.respondToRequest);
  app.post(`${baseURL}/revokeRequest`, endpoints.revokeRequest);
}
