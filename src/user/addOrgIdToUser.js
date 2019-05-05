async function addOrgIdToUser(user, orgId) {
  let orgs = [...user.orgs];
  let orgIdIndex = orgs.indexOf(orgId);

  if (orgIdIndex === -1) {
    /**
     * TODO: look for accepted notifications whose orgIds have not been assigned to the user
     * and assign them
     */
    orgs.push(orgId);
    user.orgs = orgs;
    await user.save();
  }
}

module.exports = addOrgIdToUser;
