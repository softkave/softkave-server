import { SystemResourceType } from "../../../models/system";
import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";

interface ISubscriptionableResource {
    type: SystemResourceType;
    customId: string;
}

export interface ISubscribeParameters {
    items: ISubscriptionableResource[];
}

export type SubscribeEndpoint = Endpoint<IBaseContext, ISubscribeParameters>;
