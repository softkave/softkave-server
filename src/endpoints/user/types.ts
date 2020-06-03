import { IUserOrg } from "../../mongo/user";

export interface IPublicUserData {
  customId: string;
  name: string;
  email: string;
  createdAt: Date;
  rootBlockId: string;
  orgs: IUserOrg[];
  color: string;
  notificationsLastCheckedAt?: Date;
}

export interface ICollaborator {
  customId: string;
  name: string;
  email: string;
  color: string;
}
