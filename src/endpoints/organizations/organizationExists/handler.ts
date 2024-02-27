import {validate} from '../../../utilities/joiUtils';
import {OrganizationExistsEndpoint} from './types';
import {organizationExistsJoiSchema} from './validation';

const organizationExists: OrganizationExistsEndpoint = async (context, instData) => {
  const data = validate(instData.data, organizationExistsJoiSchema);
  const exists = await context.data.workspace.existsByQuery(context, {
    name: {$regex: new RegExp(`^${data.name}$`, 'i')},
  });
  return {exists};
};

export default organizationExists;
