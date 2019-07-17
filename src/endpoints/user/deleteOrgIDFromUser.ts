import { IUserDocument } from "./user";

// TODO: convert all id to ID
export interface IDeleteOrgIDFromUserParameters {
  user: IUserDocument;
  id: string;
}

async function deleteOrgIdFromUser({
  user,
  id
}: IDeleteOrgIDFromUserParameters) {
  const orgs = [...user.orgs];
  const orgIdIndex = orgs.findIndex(orgId => id === orgId);

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

export default deleteOrgIdFromUser;
