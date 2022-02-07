import { IParentInformation } from "../../../mongo/definitions";
import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";
import { IPublicCustomPropertyValue } from "../types";

export interface IGetValuesEndpointParams {
    parents: Array<IParentInformation>;
}

export interface IGetValuesEndpointResult {
    values: IPublicCustomPropertyValue[];
}

export type GetValuesEndpoint = Endpoint<
    IBaseContext,
    IGetValuesEndpointParams,
    IGetValuesEndpointResult
>;
