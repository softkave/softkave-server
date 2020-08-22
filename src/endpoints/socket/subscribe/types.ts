import { AuditLogResourceType } from "../../../mongo/audit-log";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface ISubscribeParameters {
  type: AuditLogResourceType;
  customId: string;
}

export type SubscribeEndpoint = Endpoint<IBaseContext, ISubscribeParameters>;
