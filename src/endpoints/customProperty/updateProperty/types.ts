import {
    CustomPropertyType,
    IDateCustomTypeMeta,
    INumberCustomTypeMeta,
    ISelectionCustomTypeMeta,
    ITextCustomTypeMeta,
} from "../../../mongo/custom-property/definitions";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicCustomProperty } from "../types";

export interface IUpdatePropertyEndpointParams {
    customId: string;
    property: {
        name?: string;
        description?: string;
        type: CustomPropertyType;
        isRequired?: boolean;

        // pass in the full meta, not the changes
        meta?:
            | ITextCustomTypeMeta
            | ISelectionCustomTypeMeta
            | IDateCustomTypeMeta
            | INumberCustomTypeMeta;
    };
}

export interface IUpdatePropertyEndpointResult {
    property: IPublicCustomProperty;
}

export type UpdatePropertyEndpoint = Endpoint<
    IBaseContext,
    IUpdatePropertyEndpointParams,
    IUpdatePropertyEndpointResult
>;
