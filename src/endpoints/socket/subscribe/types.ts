import { AuditLogResourceType } from "../../../mongo/audit-log";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface ISubscribeParameters {
  type: AuditLogResourceType;
  id: string;
}

export interface ISubscribeContext extends IBaseContext {}

export type SubscribeEndpoint = Endpoint<
  ISubscribeContext,
  ISubscribeParameters
>;
