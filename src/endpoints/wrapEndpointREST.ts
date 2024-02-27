import {cast} from '../utilities/fns';
import OperationError, {IStrippedOperationError} from '../utilities/OperationError';
import {getBaseContext} from './contexts/BaseContext';
import {IServerRequest} from './contexts/types';
import {WrapperError} from './errors';
import RequestData from './RequestData';
import {Endpoint, GetEndpointContext, GetEndpointParam, GetEndpointResult} from './types';

export const wrapEndpointREST = <TEndpoint extends Endpoint<any, any, any>>(
  endpoint: TEndpoint,
  ctx?: GetEndpointContext<TEndpoint>
) => {
  return async (
    data: GetEndpointParam<TEndpoint>,
    req: IServerRequest
  ): Promise<GetEndpointResult<TEndpoint>> => {
    try {
      /**
       * When the context the endpoint uses differ from IBaseContext,
       * make sure to privide yours cause it could cause unexpected behaviour
       * during runtime
       */
      const requestContext = ctx || cast<any>(getBaseContext());
      return await endpoint(
        requestContext,
        RequestData.fromExpressRequest(requestContext, req, data)
      );
    } catch (error) {
      console.error(error);
      const errors =
        error instanceof WrapperError ? error.cause ?? [] : Array.isArray(error) ? error : [error];
      const preppedErrors: IStrippedOperationError[] = [];
      cast<OperationError[]>(errors).forEach(
        err =>
          err &&
          err.isPublic &&
          preppedErrors.push({
            name: err.name,
            message: err.message,
            action: err.action,
            field: err.field,
          })
      );
      return {errors: preppedErrors} as Awaited<GetEndpointResult<TEndpoint>>;
    }
  };
};
