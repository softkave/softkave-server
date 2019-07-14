const { validators } = require("../../utils/validation-utils");
const { validateCollaborationRequest } = require("./validation");
const { notificationErrors } = require("../../utils/notificationError");

async function updateCollaborationRequest({
  customId,
  data,
  user,
  notificationModel
}) {
  customId = validators.validateUUID(customId);
  data = validateCollaborationRequest(data);
  let notification = await notificationModel.model
    .findOneAndUpdate(
      {
        customId: customId,
        "to.email": user.email
      },
      data,
      {
        lean: true,
        fields: "customId"
      }
    )
    .exec();

  if (!!!notification) {
    throw notificationErrors.requestDoesNotExist;
  }
}

module.exports = updateCollaborationRequest;
export {};
