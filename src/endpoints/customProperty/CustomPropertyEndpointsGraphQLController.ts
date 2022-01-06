import makeSingletonFn from "../../utilities/createSingletonFunc";
import { wrapEndpointREST } from "../utils";
import changeOptionPosition from "./changeOptionPosition/handler";
import createOption from "./createOption/handler";
import createProperty from "./createProperty/handler";
import deleteOption from "./deleteOption/handler";
import deleteProperty from "./deleteProperty/handler";
import getProperties from "./getProperties/handler";
import getValues from "./getValues/handler";
import insertCustomValue from "./insertCustomValue/handler";
import updateCustomValue from "./updateCustomValue/handler";
import updateOption from "./updateOption/handler";
import updateProperty from "./updateProperty/handler";

export default class CustomPropertyEndpointsGraphQLController {
    public createOption = wrapEndpointREST(createOption);
    public changeOptionPosition = wrapEndpointREST(changeOptionPosition);
    public createProperty = wrapEndpointREST(createProperty);
    public deleteOption = wrapEndpointREST(deleteOption);
    public deleteProperty = wrapEndpointREST(deleteProperty);
    public getProperties = wrapEndpointREST(getProperties);
    public getValues = wrapEndpointREST(getValues);
    public insertCustomValue = wrapEndpointREST(insertCustomValue);
    public updateCustomValue = wrapEndpointREST(updateCustomValue);
    public updateOption = wrapEndpointREST(updateOption);
    public updateProperty = wrapEndpointREST(updateProperty);
}

export const getCustomPropertyEndpointsGraphQLController = makeSingletonFn(
    () => new CustomPropertyEndpointsGraphQLController()
);
