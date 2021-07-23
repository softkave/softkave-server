import { BlockType } from "../../mongo/block/definitions";
import { IUserOrganization } from "../../mongo/user";
import { ConvertDatesToStrings } from "../../utilities/types";

export type IPublicUserData = ConvertDatesToStrings<{
    customId: string;
    name: string;
    email: string;
    createdAt: string;
    rootBlockId: string;
    organizations: IUserOrganization[];
    color: string;
    notificationsLastCheckedAt?: string;
}>;

export interface IUserRootBlock {
    customId: string;
    createdBy: string;
    createdAt: Date;
    type: BlockType.Root;
    name: string;
    color: string;
}
