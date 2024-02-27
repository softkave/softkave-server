import {Express} from 'express';
import {IBaseContext} from '../contexts/IBaseContext';
import {wrapEndpointREST} from '../utils';
import updateClient from './updateClient/handler';

const baseURL = '/api/clients';
export default function setupClientsRESTEndpoints(ctx: IBaseContext, app: Express) {
  const endpoints = {
    updateClient: wrapEndpointREST(updateClient, ctx),
  };

  app.post(`${baseURL}/updateClient`, endpoints.updateClient);
}
