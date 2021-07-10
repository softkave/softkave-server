import { ConvertDatesToStrings } from "../../utilities/types";

export type ICollaborator = ConvertDatesToStrings<{
    customId: string;
    name: string;
    email: string;
    color: string;
}>;
