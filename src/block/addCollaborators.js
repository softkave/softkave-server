const collaborationRequestModel = require("../mongo/notification");
const sendCollabReqEmail = require("./sendCollabReqEmail");
const {
  validateBlock,
  validateNewCollaborators
} = require("./validator");
const {
  RequestError
} = require("../error");
const canUserPerformAction = require("./canUserPerformAction");
const getUserFromReq = require("../getUserFromReq");

async function addCollaborator({
  block,
  collaborators,
  body,
  expiresAt
}, req) {
  await validateBlock(block);
  await validateNewCollaborators(collaborators);
  block = await canUserPerformAction(req, block, "SEND_REQUEST");
  const collaboratorsEmailArr = collaborators.map(c => {
    return c.email.toLowerCase();
  });

  const existingCollabReqQuery = {
    "to.email": {
      $in: collaboratorsEmailArr
    },
    "from.blockId": block.id
  };

  let existingCollaborationRequests = await collaborationRequestModel.model
    .find(existingCollabReqQuery, "to.email createdAt")
    .lean()
    .exec();

  if (existingCollaborationRequests.length > 0) {
    throw new RequestError(
      "error",
      existingCollaborationRequests.map(e => e.to.email).join(" ") +
      " - the above emails have been sent collaboration requests already"
    );
  }

  let user = await getUserFromReq(req);
  let collaborationRequests = collaborators.map(c => {
    let notificationBody =
      c.body ||
      body ||
      `
      You have been invited by ${user.name} to collaborate in ${block.name}.
    `;

    return {
      _id: c.id,
      from: {
        userId: user.id,
        name: user.name,
        blockId: block.id,
        blockName: block.name
      },
      createdAt: Date.now(),
      body: notificationBody,
      to: {
        email: c.email.toLowerCase()
      },
      type: "collab-req",
      expiresAt: c.expiresAt || expiresAt || null,
      statusHistory: [{
        status: "pending",
        date: Date.now()
      }]
    };
  });

  await collaborationRequestModel.model.insertMany(collaborationRequests);

  // TODO:
  // maybe deffer sending email till end of day

  sendEmails();

  function sendEmails() {
    let emailPromises = collaborationRequests.map(col => {
      return sendCollabReqEmail(col.to.email, user.name, block.name);
    });

    emailPromises.forEach(async (promise, i) => {
      try {
        await promise;
        const request = collaborationRequests[i];
        collaborationRequestModel
          .newModel()
          .updateOne({
            _id: request._id
          }, {
            $push: {
              sentEmailHistory: {
                date: Date.now()
              }
            }
          })
          .exec();
      } catch (error) {
        console.error(error);
      }
    });
  }
}

module.exports = addCollaborator;