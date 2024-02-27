import {faker} from '@faker-js/faker';
import {makeAddCollaboratorContext} from '../../collaborationRequests/addCollaborators/context';
import addCollaborators from '../../collaborationRequests/addCollaborators/handler';
import {
  IAddCollaboratorsParameters,
  INewCollaboratorInput,
} from '../../collaborationRequests/addCollaborators/types';
import {IBaseContext} from '../../contexts/IBaseContext';
import {IServerRequest} from '../../contexts/types';
import RequestData from '../../RequestData';
import {assertResultOk} from '../utils';
import assert = require('assert');

export async function setupTestCollaborationRequestWithEndpoint(
  context: IBaseContext,
  req: IServerRequest,
  orgId: string,
  input: Partial<INewCollaboratorInput>[] = [],
  count = 2
) {
  if (input.length < count) {
    for (let i = count - input.length; i > 0; i--) {
      input.push({});
    }
  }

  const result = await addCollaborators(
    makeAddCollaboratorContext(context),
    RequestData.fromExpressRequest<IAddCollaboratorsParameters>(context, req, {
      organizationId: orgId,
      collaborators: input.map(item => ({
        email: faker.internet.email(),
        ...item,
      })),
    })
  );

  assertResultOk(result);
  assert(result);
  assert.ok(result.requests);
  return {
    requests: result.requests,
  };
}
