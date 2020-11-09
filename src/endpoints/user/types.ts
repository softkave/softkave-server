import { IUserOrg } from "../../mongo/user";
import { ConvertDatesToStrings } from "../../utilities/types";

export type IPublicUserData = ConvertDatesToStrings<{
    customId: string;
    name: string;
    email: string;
    createdAt: string;
    rootBlockId: string;
    orgs: IUserOrg[];
    color: string;
    notificationsLastCheckedAt?: string;
}>;

export type ICollaborator = ConvertDatesToStrings<{
    customId: string;
    name: string;
    email: string;
    color: string;
}>;
