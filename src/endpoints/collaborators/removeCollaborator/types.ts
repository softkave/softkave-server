import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';

export interface IRemoveCollaboratorParameters {
  organizationId: string;
  collaboratorId: string;
}

export type RemoveCollaboratorEndpoint = Endpoint<IBaseContext, IRemoveCollaboratorParameters>;
