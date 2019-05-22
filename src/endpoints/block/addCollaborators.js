const sendCollabReqEmail = require("./sendCollabReqEmail");
const { RequestError } = require("../../utils/error");
const canReadBlock = require("./canReadBlock");
const {
  validateBlock,
  validateAddCollaboratorCollaborators
} = require("./validation");

async function addCollaborator({
  block,
  collaborators,
  user,
  notificationModel,
  blockModel
}) {
  block = validateBlock(block);
  collaborators = validateAddCollaboratorCollaborators(collaborators);
  collaborators = validateAddCollaboratorParams;
  block = await blockModel.model.findOne({ customId: block.customId });
  await canReadBlock({ block, user });

  const collaboratorsEmailArr = collaborators.map(c => {
    return c.email.toLowerCase();
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
    const errors = existingCollaborationRequests.map(c => {
      return new RequestError("system.request-sent", c.to.email);
    });

    throw errors;
  }

  let collaborationRequests = collaborators.map(c => {
    let notificationBody =
      c.body ||
      `
      You have been invited by ${user.name} to collaborate in ${block.name}.
    `;

    return {
      customId: c.customId,
      from: {
        userId: user.customId,
        name: user.name,
        blockId: block.customId,
        blockName: block.name
      },
      createdAt: Date.now(),
      body: notificationBody,
      to: {
        email: c.email.toLowerCase()
      },
      type: "collab-req",
      expiresAt: c.expiresAt || null,
      statusHistory: [
        {
          status: "pending",
          date: Date.now()
        }
      ]
    };
  });

  await notificationModel.model.insertMany(collaborationRequests);

  // TODO: maybe deffer sending email till end of day
  sendEmails(collaborationRequests);

  function sendEmails(collaborationRequests) {
    let emailPromises = collaborationRequests.map(col => {
      return sendCollabReqEmail({
        email: col.to.email,
        userName: user.name,
        blockName: block.name,
        message: col.body,
        expires: col.expiresAt
      });
    });

    // TODO: Resend collab requests that have not been sent
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
