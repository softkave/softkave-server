import { AuditLogResourceType } from "../../../mongo/audit-log";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

interface ISubscriptionableResource {
    type: AuditLogResourceType;
    customId: string;
}

export interface ISubscribeParameters {
    items: ISubscriptionableResource[];
}

export type SubscribeEndpoint = Endpoint<IBaseContext, ISubscribeParameters>;
