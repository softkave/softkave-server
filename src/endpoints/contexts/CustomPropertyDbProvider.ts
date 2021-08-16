import { ICustomProperty } from "../../mongo/custom-property/definitions";
import { IUpdateItemById } from "../../utilities/types";
import { IBaseContext } from "./BaseContext";

export interface ICustomPropertyDbProvider {
    saveCustomProperty: (
        ctx: IBaseContext,
        customproperty: Omit<ICustomProperty, "customId">
    ) => Promise<ICustomProperty>;
    getCustomPropertyById: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<ICustomProperty | undefined>;
    assertGetCustomPropertyById: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<ICustomProperty>;
    getMany: (ctx: IBaseContext, ids: string[]) => Promise<ICustomProperty[]>;
    getManyByParentId: (
        ctx: IBaseContext,
        id: string
    ) => Promise<ICustomProperty[]>;
    updateCustomPropertyById: (
        ctx: IBaseContext,
        customId: string,
        data: Partial<ICustomProperty>
    ) => Promise<ICustomProperty | undefined>;
    bulkUpdateCustomPropertysById: (
        ctx: IBaseContext,
        custompropertys: Array<IUpdateItemById<ICustomProperty>>
    ) => Promise<void>;
    customPropertyExists: (
        ctx: IBaseContext,
        name: string,
        boardId: string
    ) => Promise<boolean>;
    deleteCustomProperty: (
        ctx: IBaseContext,
        custompropertyId: string
    ) => Promise<void>;
}
