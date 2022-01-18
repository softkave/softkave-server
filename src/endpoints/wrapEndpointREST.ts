import { cast } from "../utilities/fns";
import { IBaseContext } from "./contexts/IBaseContext";
import { IServerRequest } from "./contexts/types";
import RequestData from "./RequestData";
import { Endpoint } from "./types";

export const wrapEndpointREST = <
    Params,
    Result,
    Context extends IBaseContext = IBaseContext
>(
    endpoint: Endpoint<Context, Params, Result>,
    context?: Context
) => {
    return async (
        data: Params,
        req: IServerRequest
    ): Promise<ReturnType<Endpoint<IBaseContext, Params, Result>>> => {
        try {
            // When the context the endpoint uses differ from IBaseContext,
            // make sure to privide yours cause it could cause unexpected behaviour
            // during runtime
            return await endpoint(
                // Casting here is not particularly okay, but okay if calling functions
                // provide their context if different from IBaseContext
                context,
                RequestData.fromExpressRequest(context, req, data)
            );
        } catch (error) {
            const errors = Array.isArray(error) ? error : [error];
            console.error(error);
            return cast({
                errors: errors.map((err) => ({
                    name: err.name,
                    message: err.message,
                    action: err.action,
                    field: err.field,
                })),
            });
        }
    };
};
