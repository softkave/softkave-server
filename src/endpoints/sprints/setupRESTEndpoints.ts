import {Express} from 'express';
import {IBaseContext} from '../contexts/IBaseContext';
import {wrapEndpointREST} from '../utils';
import addSprint from './addSprint/addSprint';
import deleteSprint from './deleteSprint/deleteSprint';
import getSprints from './getSprints/getSprints';
import sprintExists from './sprintExists/sprintExists';
import updateSprint from './updateSprint/updateSprint';

const baseURL = '/api/sprints';
export default function setupSprintsRESTEndpoints(ctx: IBaseContext, app: Express) {
  const endpoints = {
    addSprint: wrapEndpointREST(addSprint, ctx),
    deleteSprint: wrapEndpointREST(deleteSprint, ctx),
    getSprints: wrapEndpointREST(getSprints, ctx),
    sprintExists: wrapEndpointREST(sprintExists, ctx),
    updateSprint: wrapEndpointREST(updateSprint, ctx),
  };

  app.post(`${baseURL}/addSprint`, endpoints.addSprint);
  app.post(`${baseURL}/deleteSprint`, endpoints.deleteSprint);
  app.post(`${baseURL}/getSprints`, endpoints.getSprints);
  app.post(`${baseURL}/sprintExists`, endpoints.sprintExists);
  app.post(`${baseURL}/updateSprint`, endpoints.updateSprint);
}
