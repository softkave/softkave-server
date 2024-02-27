import { Request, Response } from 'express';
import { isArray, isDate, isFunction, isNull, isObject, omit, pick } from 'lodash';
import { Document } from 'mongoose';
import { IResource, IResourceWithDescriptor, IWorkspaceResource } from '../models/resource';
import { SystemResourceType } from '../models/system';
import mongoConstants from '../mongo/constants';
import OperationError, { IStrippedOperationError } from '../utilities/OperationError';
import { ServerError } from '../utilities/errors';
import { cast, getDateString, getDateStringIfExists, indexArray } from '../utilities/fns';
import { getResourceTypeFromId } from '../utilities/ids';
import { Omit1 } from '../utilities/types';
import RequestData from './RequestData';
import { IBaseContext } from './contexts/IBaseContext';
import { IServerRequest } from './contexts/types';
import { NotFoundError, WrapperError } from './errors';
import {
  Endpoint,
  ExtractFieldsDefaultScalarTypes,
  ExtractFieldsFrom,
  GetEndpointContext,
  GetEndpointResult,
  IEndpointQueryPaginationOptions,
  IEndpointQuerySortOptions,
  IObjectPaths,
  IUpdateComplexTypeArrayInput,
} from './types';

export const fireAndForgetFn = <Fn extends (...args: any) => any>(
  fn: Fn,
  ...args: Array<Parameters<Fn>>
): void => {
  setTimeout(async () => {
    try {
      await fn(...args);
    } catch (error) {
      console.error(error);
    }
  }, 5);
};

export const fireAndForgetPromise = async <T>(promise: Promise<T>) => {
  try {
    return await promise;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const wrapFireAndThrowErrorAsync = <Fn extends (...args: any[]) => any>(
  fn: Fn,
  throwError = true
): Fn => {
  return cast<Fn>(async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(error);
      if (throwError) {
        throw error;
      }
    }
  });
};

export const wrapFireAndThrowErrorRegular = <Fn extends (...args: any[]) => any>(
  fn: Fn,
  throwError = true
): Fn => {
  return cast<Fn>((...args: any[]) => {
    try {
      return fn(...args);
    } catch (error) {
      console.error(error);
      if (throwError) {
        throw error;
      }
    }
  });
};

export const wrapFireAndDontThrowAsync: typeof wrapFireAndThrowErrorAsync = fn => {
  return wrapFireAndThrowErrorAsync(fn, false);
};

export async function tryCatch<T extends (...args: any) => any>(
  fn: T
): Promise<ReturnType<T> | null> {
  try {
    return await fn();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function getFields<
  T extends object,
  ScalarTypes = ExtractFieldsDefaultScalarTypes,
  ExtraArgs = any,
  Result extends Partial<Record<keyof T, any>> = T
>(data: ExtractFieldsFrom<T, ScalarTypes, ExtraArgs, Result>): IObjectPaths<T, ExtraArgs, Result> {
  const keys = Object.keys(data);
  return keys.reduce(
    (paths, key) => {
      const value: any = (data as any)[key];
      if (isFunction(value)) {
        paths.scalarFieldsWithTransformers.push({
          property: key,
          transformer: value,
        });
      } else if (!isNull(value) && isObject(value) && !isDate(value)) {
        paths.objectFields.push({
          property: key,
          fields: getFields(value as any),
        });
      } else {
        paths.scalarFields.push(key);
      }

      return paths;
    },
    {
      scalarFields: [],
      scalarFieldsWithTransformers: [],
      objectFields: [],
      object: cast<T>({}),
      extraArgs: cast<ExtraArgs>({}),
      result: cast<Result>({}),
    } as IObjectPaths<T, ExtraArgs, Result>
  );
}

export function extractFields<
  ObjectPaths extends IObjectPaths<any, any, any>,
  Data extends Partial<Record<keyof ObjectPaths['object'], any>> = ObjectPaths['object']
>(data: Data, paths: ObjectPaths, extraArgs?: ObjectPaths['extraArgs']): ObjectPaths['result'] {
  const result = pick(data, paths.scalarFields);
  paths.scalarFieldsWithTransformers.forEach(({property, transformer}) => {
    const propValue = data[property];
    if (propValue === undefined) {
      return;
    }

    result[property] = propValue === null ? null : transformer(propValue, extraArgs);
  });

  paths.objectFields.forEach(({property, fields}) => {
    const propValue = data[property];
    if (propValue === undefined) {
      return;
    }

    result[property] = isArray(propValue)
      ? propValue.map(value => extractFields(value, fields, extraArgs))
      : propValue === null
      ? null
      : extractFields(propValue, fields, extraArgs);
  });

  return result as unknown as ObjectPaths['result'];
}

export function getComplexTypeArrayInput<T>(
  input: IUpdateComplexTypeArrayInput<T>,
  indexPath: T extends object ? keyof T : never
): Required<IUpdateComplexTypeArrayInput<T>> & {
  addMap: {
    [key: string]: NonNullable<Required<IUpdateComplexTypeArrayInput<T>>['add']>[0];
  };
  updateMap: {
    [key: string]: NonNullable<Required<IUpdateComplexTypeArrayInput<T>>['update']>[0];
  };
  removeMap: {
    [key: string]: NonNullable<Required<IUpdateComplexTypeArrayInput<T>>['remove']>[0];
  };
} {
  return {
    add: input.add || [],
    remove: input.remove || [],
    update: input.update || [],
    addMap: indexArray(input.add || [], {path: indexPath}),
    updateMap: indexArray(input.update || [], {path: indexPath}),
    removeMap: indexArray(input.remove || []),
  };
}

// TODO: internal/nested docs with customId or unique indexes should be validated before call
// TODO: It's possible that the unique error may be from another field, and not customId.
// how do we handle that?
export async function saveNewItemToDb<Fn extends (...args: any) => any>(
  saveFn: Fn
): Promise<ReturnType<Fn>> {
  let tryAgain = false;
  do {
    try {
      const doc = await saveFn();
      return doc;
    } catch (error: any) {
      console.error(error);

      // Adding a resource fails with code 11000 if unique fields like customId
      if (error.code === mongoConstants.indexNotUniqueErrorCode) {
        // Retry once, and throw error if it occurs again
        if (!tryAgain) {
          tryAgain = true;
          continue;
        } else {
          tryAgain = false;
        }
      }

      console.error(error);
      throw new ServerError();
    }
  } while (tryAgain);

  throw new ServerError();
}

// TODO: there are two wrap endpoints, find a fix
export const wrapEndpointREST = <E extends Endpoint<any, any, any>>(
  endpoint: E,
  context: GetEndpointContext<E>,
  handleResponse?: (res: Response, result: Awaited<GetEndpointResult<E>>) => void
): ((req: Request, res: Response) => any) => {
  return async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const instData = RequestData.fromExpressRequest(
        context,
        req as unknown as IServerRequest,
        data
      );

      const result = await endpoint(context, instData);
      if (handleResponse) {
        handleResponse(res, result);
      } else {
        res.status(200).json(result || {});
      }
    } catch (error) {
      const errors =
        error instanceof WrapperError ? error.cause ?? [] : Array.isArray(error) ? error : [error];

      // TODO: move to winston
      console.error(error);
      console.log('-- Error END'); // for spacing

      // We are mapping errors cause some values don't show if we don't
      // or was it errors, not sure anymore, this is old code.
      // TODO: Feel free to look into it, cause it could help performance.
      const preppedErrors: IStrippedOperationError[] = [];
      cast<OperationError[]>(errors).forEach(err => {
        if (err.isPublic) {
          preppedErrors.push({
            name: err.name,
            message: err.message,
            action: err.action,
            field: err.field,
          });
        } else {
          preppedErrors.push(new ServerError());
        }
      });

      const result = {
        errors: preppedErrors,
      };

      res.status(500).json(result);
    }
  };
};

export function getEndpointPaginationOptions<T extends IEndpointQueryPaginationOptions>(
  p: T
): IEndpointQueryPaginationOptions {
  return {
    page: p.page,
    pageSize: p.pageSize,
  };
}

export function getEndpointSortOptions<T extends IEndpointQuerySortOptions>(
  p: T
): IEndpointQuerySortOptions {
  return {
    sort: p.sort,
  };
}

export function omitMongoId<T = any>(resource: T): T extends {_id: string} ? Omit1<T, '_id'> : T {
  if ((resource as Document)?._id) {
    return omit(resource as object, '_id') as any;
  }
  return resource as any;
}

export type ResourceWithIdQuery = {id: string; type?: SystemResourceType};
export async function fetchResourceList(ctx: IBaseContext, queries: Array<ResourceWithIdQuery>) {
  const promises = queries.map(q => {
    const type = q.type ?? getResourceTypeFromId(q.id);

    switch (type) {
      case SystemResourceType.User:
        return ctx.data.user.getOneByQuery(ctx, {customId: q.id});
      case SystemResourceType.AnonymousUser:
        return ctx.data.anonymousUser.getOneByQuery(ctx, {customId: q.id});
      case SystemResourceType.Client:
        return ctx.client.getClientById(ctx, q.id);
      case SystemResourceType.Workspace:
        return ctx.data.workspace.getOneByQuery(ctx, {customId: q.id});
      case SystemResourceType.Board:
        return ctx.data.board.getOneByQuery(ctx, {customId: q.id});
      case SystemResourceType.Task:
        return ctx.data.task.getOneByQuery(ctx, {customId: q.id});
      case SystemResourceType.ChatRoom:
        return ctx.chat.getRoomById(ctx, q.id);
      case SystemResourceType.Sprint:
        return ctx.sprint.getSprintById(ctx, q.id);
      case SystemResourceType.CollaborationRequest:
        return ctx.collaborationRequest.getCollaborationRequestById(ctx, q.id);
      case SystemResourceType.PermissionItem:
        return ctx.data.permissionItem.getOneByQuery(ctx, {customId: q.id});
      case SystemResourceType.PermissionGroup:
        return ctx.data.permissionGroup.getOneByQuery(ctx, {customId: q.id});
      case SystemResourceType.Eav:
        return ctx.data.eav.getOneByQuery(ctx, {customId: q.id});
      case SystemResourceType.UserToken:
        return ctx.data.token.getOneByQuery(ctx, {customId: q.id});

      case SystemResourceType.Status:
      case SystemResourceType.Label:
      case SystemResourceType.TaskResolution:
      case SystemResourceType.Note:
      case SystemResourceType.SubTask:
      case SystemResourceType.Notification:
      case SystemResourceType.CustomProperty:
      case SystemResourceType.CustomValue:
      case SystemResourceType.EndpointRequest:
      case SystemResourceType.PushSubscription:
      case SystemResourceType.Chat:
      case SystemResourceType.Comment:
      default:
        throw new Error('Not implemented yet');
    }
  });

  const rList = await Promise.all(promises);
  const resources: Array<IResourceWithDescriptor<IResource> | null> = rList.map((r, i) =>
    r
      ? {
          customId: r.customId,
          type: queries[i].type ?? getResourceTypeFromId(r.customId),
          data: r,
        }
      : null
  );
  return resources;
}

export function assertNotFound<T>(r?: T | null): asserts r {
  if (!r) throw new NotFoundError();
}

export const publicResourceFields: ExtractFieldsFrom<IResource> = {
  customId: true,
  isDeleted: true,
  deletedBy: true,
  deletedAt: getDateStringIfExists,
  createdAt: getDateString,
  lastUpdatedAt: getDateStringIfExists,
};
export const publicWorkspaceResourceFields: ExtractFieldsFrom<IWorkspaceResource> = {
  ...publicResourceFields,
  workspaceId: true,
  visibility: true,
  createdBy: true,
  lastUpdatedBy: true,
};
