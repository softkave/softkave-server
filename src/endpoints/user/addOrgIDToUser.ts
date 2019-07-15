import { IUserDocument } from "./user";

export interface IAddOrgIDToUserParameters {
  user: IUserDocument;
  ID: string;
}

async function addOrgIDToUser({ user, ID }: IAddOrgIDToUserParameters) {
  const orgs = [...user.orgs];
  const orgIdIndex = orgs.indexOf(ID);

  if (orgIdIndex === -1) {
    /**
     * TODO: look for accepted notifications whose orgIds have not been
     * assigned to the user and assign them
     */
    orgs.push(ID);
    user.orgs = orgs;
    await user.save();
  }
}

export default addOrgIDToUser;
