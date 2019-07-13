const { errors: userErrors } = require("../../utils/userErrorMessages");
const { validators } = require("../../utils/validation-utils");

async function getUser({ collaborator, userModel, required }) {
  collaborator = validators.validateUUID(collaborator);
  const query = {
    customId: collaborator
  };

  const fetchedCollaborator = await userModel.model.findOne(query).exec();

  if (!fetchedCollaborator && required) {
    throw userErrors.collaboratorDoesNotExist;
  }

  return fetchedCollaborator;
}

module.exports = getUser;
