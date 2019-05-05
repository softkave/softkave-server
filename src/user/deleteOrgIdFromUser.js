async function deleteOrgIdFromUser(user, orgId) {
  let orgs = [...user.orgs];
  let orgIdIndex = orgs.findIndex(id => id === orgId);

  if (orgIdIndex !== -1) {
    /**
     * TODO: look for accepted notifications whose orgIds have not been assigned to the user
     * and assign them
     */
    orgs.splice(orgIdIndex, 1);
    user.orgs = orgs;
    await user.save();
  }
}

module.exports = deleteOrgIdFromUser;
