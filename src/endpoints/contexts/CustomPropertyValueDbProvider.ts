import { ICustomPropertyValue } from "../../mongo/custom-property/definitions";
import { IParentInformation } from "../../mongo/definitions";
import { IUpdateItemById } from "../../utilities/types";
import { IBaseContext } from "./IBaseContext";

export interface ICustomPropertyValueDbProvider {
    saveCustomPropertyValue: (
        ctx: IBaseContext,
        value: ICustomPropertyValue
    ) => Promise<ICustomPropertyValue>;
    getCustomPropertyValueById: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<ICustomPropertyValue | undefined>;
    getMany: (
        ctx: IBaseContext,
        ids: string[]
    ) => Promise<ICustomPropertyValue[]>;
    getOneValueByParent: (
        ctx: IBaseContext,
        parent: IParentInformation,
        propertyId: string
    ) => Promise<ICustomPropertyValue>;
    getValuesByParents: (
        ctx: IBaseContext,
        parents: IParentInformation[]
    ) => Promise<ICustomPropertyValue[]>;
    updateCustomPropertyValueById: (
        ctx: IBaseContext,
        customId: string,
        data: Partial<ICustomPropertyValue>
    ) => Promise<ICustomPropertyValue | undefined>;
    bulkUpdateCustomPropertyValuesById: (
        ctx: IBaseContext,
        values: Array<IUpdateItemById<ICustomPropertyValue>>
    ) => Promise<void>;
    customPropertyValueExists: (
        ctx: IBaseContext,
        name: string,
        boardId: string
    ) => Promise<boolean>;
    deleteValue: (ctx: IBaseContext, id: string) => Promise<void>;
    deleteManyByPropertyId: (ctx: IBaseContext, id: string) => Promise<void>;
}
