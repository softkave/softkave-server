import { defaultTo } from "lodash";
import { cast } from "../utilities/fns";
import OperationError, {
  IStrippedOperationError,
} from "../utilities/OperationError";
import { getBaseContext } from "./contexts/BaseContext";
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
        defaultTo(context, cast<Context>(getBaseContext())),
        RequestData.fromExpressRequest(context, req, data)
      );
    } catch (error) {
      console.error(error);
      console.log("-- Error END"); // for spacing
      const errors = Array.isArray(error) ? error : [error];
      const preppedErrors: IStrippedOperationError[] = [];
      cast<OperationError[]>(errors).forEach(
        (err) =>
          err.isPublic &&
          preppedErrors.push({
            name: err.name,
            message: err.message,
            action: err.action,
            field: err.field,
          })
      );

      return cast({
        errors: preppedErrors,
      });
    }
  };
};
