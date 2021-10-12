import makeSingletonFn from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
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
    public async createOption(data, req) {
        // @ts-ignore
        const instData = RequestData.fromExpressRequest(
            getBaseContext(),
            req,
            data
        );

        return wrapEndpoint(data, req, async () =>
            createOption(getBaseContext(), instData)
        );
    }

    public changeOptionPosition(data, req) {
        return wrapEndpoint(data, req, async () =>
            changeOptionPosition(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public createProperty(data, req) {
        return wrapEndpoint(data, req, async () =>
            createProperty(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public deleteOption(data, req) {
        return wrapEndpoint(data, req, async () =>
            deleteOption(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public deleteProperty(data, req) {
        return wrapEndpoint(data, req, async () =>
            deleteProperty(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public getProperties(data, req) {
        return wrapEndpoint(data, req, async () =>
            getProperties(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public getValues(data, req) {
        return wrapEndpoint(data, req, async () =>
            getValues(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public insertCustomValue(data, req) {
        return wrapEndpoint(data, req, async () =>
            insertCustomValue(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public updateCustomValue(data, req) {
        return wrapEndpoint(data, req, async () =>
            updateCustomValue(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public updateOption(data, req) {
        return wrapEndpoint(data, req, async () =>
            updateOption(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public updateProperty(data, req) {
        return wrapEndpoint(data, req, async () =>
            updateProperty(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }
}

export const getCustomPropertyEndpointsGraphQLController = makeSingletonFn(
    () => new CustomPropertyEndpointsGraphQLController()
);
