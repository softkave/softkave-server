const { RequestError } = require("../../utils/error");
const { validateUUID } = require("../../utils/validation-utils");
const { validateCollaborationRequest } = require("./validation");

async function updateCollaborationRequest({
  customId,
  data,
  user,
  notificationModel
}) {
  customId = validateUUID(customId);
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
    throw new RequestError("error", "notification does not exist");
  }
}

module.exports = updateCollaborationRequest;
