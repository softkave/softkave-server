import { ICustomSelectionOption } from "../../mongo/custom-property/definitions";
import { IParentInformation } from "../../mongo/definitions";
import { IUpdateItemById } from "../../utilities/types";
import { IBaseContext } from "./IBaseContext";

export interface ICustomSelectionOptionDbProvider {
    saveOption: (
        ctx: IBaseContext,
        customselectionoption: Omit<ICustomSelectionOption, "customId">
    ) => Promise<ICustomSelectionOption>;
    getOptionById: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<ICustomSelectionOption | null | undefined>;
    assertGetOptionById: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<ICustomSelectionOption>;
    assertOptionById: (ctx: IBaseContext, customId: string) => Promise<boolean>;
    getMany: (
        ctx: IBaseContext,
        ids: string[]
    ) => Promise<ICustomSelectionOption[]>;
    updateOptionById: (
        ctx: IBaseContext,
        customId: string,
        data: Partial<ICustomSelectionOption>
    ) => Promise<ICustomSelectionOption | null | undefined>;
    updateOptionsById: (
        ctx: IBaseContext,
        customselectionoptions: Array<IUpdateItemById<ICustomSelectionOption>>
    ) => Promise<void>;
    exists: (ctx: IBaseContext, name: string) => Promise<boolean>;
    deleteOption: (
        ctx: IBaseContext,
        customselectionoptionId: string
    ) => Promise<void>;
    parentHasOptions: (
        ctx: IBaseContext,
        parent: IParentInformation,
        propertyId: string
    ) => Promise<boolean>;
    deleteManyByPropertyId: (ctx: IBaseContext, id: string) => Promise<void>;
}
