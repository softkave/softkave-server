async function getCollaborationRequests({ user, notificationModel }) {
  const requests = await notificationModel.model
    .find({
      "to.email": user.email
    })
    .lean()
    .exec();

  return {
    requests
  };
}

module.exports = getCollaborationRequests;
export {};
