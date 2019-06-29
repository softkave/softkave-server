const sendCollabReqEmail = require("./sendCollabReqEmail");
const { RequestError } = require("../../utils/error");
const {
  errorMessages: notificationErrorMessages,
  errorFields: notificationErrorFields
} = require("../../utils/notificationErrorMessages");
const { validateAddCollaboratorCollaborators } = require("./validation");
const {
  constants: notificationConstants
} = require("../notification/constants");

async function addCollaborator({
  block,
  collaborators,
  user,
  notificationModel
}) {
  collaborators = validateAddCollaboratorCollaborators(collaborators);

  const collaboratorsEmailArr = collaborators.map(collaborator => {
    return collaborator.email.toLowerCase();
  });

  const existingCollabReqQuery = {
    "to.email": {
      $in: collaboratorsEmailArr
    },
    "from.blockId": block.customId
  };

  let existingCollaborationRequests = await notificationModel.model
    .find(existingCollabReqQuery, "to.email createdAt")
    .lean()
    .exec();

  if (existingCollaborationRequests.length > 0) {
    const errors = existingCollaborationRequests.map(request => {
      return new RequestError(
        `${notificationErrorFields.requestHasBeenSentBefore}.${
          request.to.email
        }`,
        notificationErrorMessages.requestHasBeenSentBefore
      );
    });

    throw errors;
  }

  let collaborationRequests = collaborators.map(request => {
    let notificationBody =
      request.body ||
      `
      You have been invited by ${user.name} to collaborate in ${block.name}.
    `;

    return {
      customId: request.customId,
      from: {
        userId: user.customId,
        name: user.name,
        blockId: block.customId,
        blockName: block.name
      },
      createdAt: Date.now(),
      body: notificationBody,
      to: {
        email: request.email.toLowerCase()
      },
      type: notificationConstants,
      expiresAt: request.expiresAt || null,
      statusHistory: [
        {
          status: notificationConstants.collaborationRequestStatusTypes.pending,
          date: Date.now()
        }
      ]
    };
  });

  await notificationModel.model.insertMany(collaborationRequests);

  // TODO: maybe deffer sending email till end of day
  sendEmails(collaborationRequests);

  function sendEmails(collaborationRequests) {
    let emailPromises = collaborationRequests.map(request => {
      return sendCollabReqEmail({
        email: request.to.email,
        userName: user.name,
        blockName: block.name,
        message: request.body,
        expires: request.expiresAt
      });
    });

    // TODO: Resend collaboration requests that have not been sent or that failed
    emailPromises.forEach(async (promise, i) => {
      try {
        await promise;
        const request = collaborationRequests[i];
        notificationModel
          .newModel()
          .updateOne(
            {
              customId: request.customId
            },
            {
              $push: {
                sentEmailHistory: {
                  date: Date.now()
                }
              }
            }
          )
          .exec();
      } catch (error) {
        console.error(error);
      }
    });
  }
}

module.exports = addCollaborator;
