import {
    ICustomProperty,
    ICustomPropertyValue,
    ICustomSelectionOption,
} from "../../mongo/custom-property/definitions";
import {
    ICustomPropertyModel,
    ICustomPropertyValueModel,
    ICustomSelectionOptionModel,
} from "../../mongo/custom-property/models";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import {
    ICoreContextFunctionsWithId,
    makeCoreContextFunctionsWithId,
} from "./utils";

export type ICustomPropertyContext =
    ICoreContextFunctionsWithId<ICustomProperty>;

export interface ICustomPropertyValueContext
    extends ICoreContextFunctionsWithId<ICustomPropertyValue> {}

export interface ICustomSelectionOptionContext
    extends ICoreContextFunctionsWithId<ICustomSelectionOption> {}

const CustomPropertyCoreContextWithId = makeCoreContextFunctionsWithId<
    ICustomProperty,
    ICustomPropertyContext,
    ICustomPropertyModel
>("customProperty", "customProperty");

const CustomPropertyValueCoreContextWithId = makeCoreContextFunctionsWithId<
    ICustomPropertyValue,
    ICustomPropertyValueContext,
    ICustomPropertyValueModel
>("customPropertyValue", "customPropertyValue");

const CustomSelectionOptionCoreContextWithId = makeCoreContextFunctionsWithId<
    ICustomSelectionOption,
    ICustomSelectionOptionContext,
    ICustomSelectionOptionModel
>("customSelectionOption", "customSelectionOption");

export class CustomPropertyContext
    extends CustomPropertyCoreContextWithId
    implements ICustomPropertyContext {}

export class CustomPropertyValueContext
    extends CustomPropertyValueCoreContextWithId
    implements ICustomPropertyValueContext {}

export class CustomSelectionOptionContext
    extends CustomSelectionOptionCoreContextWithId
    implements ICustomSelectionOptionContext {}

export const getCustomPropertyContext = makeSingletonFunc(
    () => new CustomPropertyContext()
);

export const getCustomPropertyValueContext = makeSingletonFunc(
    () => new CustomPropertyValueContext()
);

export const getCustomSelectionOptionContext = makeSingletonFunc(
    () => new CustomSelectionOptionContext()
);
