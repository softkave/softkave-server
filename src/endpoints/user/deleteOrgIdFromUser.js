async function deleteOrgIdFromUser({ user, id }) {
  let orgs = [...user.orgs];
  let orgIdIndex = orgs.findIndex(orgId => id === orgId);

  if (orgIdIndex !== -1) {
    /**
     * TODO: look for accepted notifications whose orgIds
     * have not been assigned to the use and assign them
     */
    orgs.splice(orgIdIndex, 1);
    user.orgs = orgs;
    await user.save();
  }
}

module.exports = deleteOrgIdFromUser;
