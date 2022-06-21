import { Express } from "express";
import { IBaseContext } from "../contexts/IBaseContext";
import { wrapEndpointREST } from "../utils";
import sendFeedback from "./sendFeedback/sendFeedback";

const baseURL = "/api/sprints";
export default function setupSystemRESTEndpoints(
  ctx: IBaseContext,
  app: Express
) {
  const endpoints = {
    sendFeedback: wrapEndpointREST(sendFeedback, ctx),
  };

  app.post(`${baseURL}/sendFeedback`, endpoints.sendFeedback);
}
