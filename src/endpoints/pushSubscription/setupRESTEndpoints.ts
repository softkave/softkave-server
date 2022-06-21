import { Express } from "express";
import { IBaseContext } from "../contexts/IBaseContext";
import subscribe from "../rooms/subscribe/subscribe";
import unsubscribe from "../rooms/unsubscribe/unsubscribe";
import { wrapEndpointREST } from "../utils";
import getPushSubscriptionKeys from "./getPushSubscriptionKeys/handler";
import pushSubscriptionExists from "./pushSubscriptionExists/handler";

const baseURL = "/api/pushSubscription";
export default function setupPushSubscriptionRESTEndpoints(
  ctx: IBaseContext,
  app: Express
) {
  const endpoints = {
    getPushSubscriptionKeys: wrapEndpointREST(getPushSubscriptionKeys, ctx),
    pushSubscriptionExists: wrapEndpointREST(pushSubscriptionExists, ctx),
    subscribe: wrapEndpointREST(subscribe, ctx),
    unsubscribe: wrapEndpointREST(unsubscribe, ctx),
  };

  app.post(
    `${baseURL}/getPushSubscriptionKeys`,
    endpoints.getPushSubscriptionKeys
  );
  app.post(
    `${baseURL}/pushSubscriptionExists`,
    endpoints.pushSubscriptionExists
  );
  app.post(`${baseURL}/subscribe`, endpoints.subscribe);
  app.post(`${baseURL}/unsubscribe`, endpoints.unsubscribe);
}
