async function addOrgIdToUser({ user, id }) {
  let orgs = [...user.orgs];
  let orgIdIndex = orgs.indexOf(id);

  if (orgIdIndex === -1) {
    /**
     * TODO: look for accepted notifications whose orgIds have not been
     * assigned to the user and assign them
     */
    orgs.push(id);
    user.orgs = orgs;
    await user.save();
  }
}

module.exports = addOrgIdToUser;
