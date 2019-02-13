const collaborationRequestModel = require("../mongo/collaboration-request");
const sendCollabReqEmail = require("./sendCollabReqEmail");
const blockModel = require("../mongo/block");
const { validateBlock, validateNewCollaborators } = require("./validator");
const { RequestError } = require("../error");
const canUserPerformAction = require("../user/canUserPerformAction");
const getUserFromReq = require("../getUserFromReq");

async function addCollaborator({ block, collaborators }, req) {
  await validateBlock(block);
  await validateNewCollaborators(collaborators);
  const collaboratorsEmailArr = [];
  // const actionsArr = [];
  collaborators.forEach(c => {
    collaboratorsEmailArr.push(c.email);
    // actionsArr.push(`ADD_${c.role.toUpperCase()}`);
  });

  await canUserPerformAction(req, "SEND_COLLABORATION-REQUEST", block.id);
  let existingCollaborationRequests = await collaborationRequestModel.model
    .find(
      {
        "to.email": { $in: collaboratorsEmailArr },
        "from.blockId": block.owner
      },
      "to.email createdAt"
    )
    .lean()
    .exec();

  let errors = null;
  if (existingCollaborationRequests.length > 0) {
    throw new RequestError(
      "error", 
      existingCollaborationRequests.map(e => e.to.email).join(" ") 
      + " - the above emails have been sent collaboration requests already"
    );

    // errors = existingCollaborationRequests.map(request => {
    //   return new RequestError(
    //     request.to.email,
    //     `a request has been sent to this email on ${request.createdAt}`
    //   );
    // });
  }

  // if (errors.length > 0) {
  //   throw errors;
  // }

  let user = await getUserFromReq(req);
  let ownerBlock = await blockModel.model
    .findOne({ _id: block.id }, "roles")
    .lean()
    .exec();
  let blockRolesMap = {};
  ownerBlock.roles.forEach(role => {
    blockRolesMap[role.label] = role;
  });

  let collaborationRequests = collaborators.map(c => {
    if (!blockRolesMap[c.role]) {
      throw new RequestError("error", `role ${c.role} does not exist`);
    }

    let notificationBody = `
      You have been invited by ${user.name} to collaborate in ${block.name}
      with the role ${c.role}.
    `;

    return {
      from: {
        userId: user.id,
        name: user.name,
        blockId: block.id,
        blockName: block.name
      },
      createdAt: Date.now(),
      body: notificationBody,
      to: {
        email: c.email
      },
      permission: {
        role: c.role,
        level: blockRolesMap[c.role].level,
        assignedAt: Date.now(),
        assignedBy: user.id,
        type: block.type,
        blockId: block.id
      }
    };
  });

  await collaborationRequestModel.model.insertMany(collaborationRequests);
  sendEmails();

  function logFailedEmailRequests(emailPromises) {
    emailPromises.forEach(async promise => {
      try {
        await promise;
      } catch (error) {
        console.error(error);
      }
    });
  }

  function sendEmails() {
    let emailPromises = collaborators.map(col => {
      return sendCollabReqEmail(col.email, user.name, block.name);
    });

    logFailedEmailRequests(emailPromises);
  }
}

module.exports = addCollaborator;
