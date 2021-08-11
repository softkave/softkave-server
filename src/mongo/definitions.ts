import { ParentResourceType } from "../models/system";
import { ensureTypeFields } from "./utils";

export interface IParentInformation {
    type: ParentResourceType;
    customId: string;
}

export const parentSchema = ensureTypeFields<IParentInformation>({
    type: { type: String },
    customId: { type: String },
});
