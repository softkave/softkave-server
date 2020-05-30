import { IUserOrg } from "../../mongo/user";

export interface IPublicUserData {
  customId: string;
  name: string;
  email: string;
  createdAt: string;
  rootBlockId: string;
  orgs: IUserOrg[];
  color: string;
  notificationsLastCheckedAt?: string;
}

export interface ICollaborator {
  customId: string;
  name: string;
  email: string;
  color: string;
}
