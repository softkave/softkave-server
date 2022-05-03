import * as Sentry from "@sentry/node";
import bodyParser from "body-parser";
import cors, { CorsOptions } from "cors";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import expressJwt from "express-jwt";
import http from "http";
import { Server } from "socket.io";
import { indexSchema } from "./endpoints";
import setupBoardsRESTEndpoints from "./endpoints/board/setupRESTEndpoints";
import setupCollaborationRequestsRESTEndpoints from "./endpoints/collaborationRequest/setupRESTEndpoints";
import setupCollaboratorsRESTEndpoints from "./endpoints/collaborator/setupRESTEndpoints";
import { getBaseContext } from "./endpoints/contexts/BaseContext";
import { getEndpointsGraphQLController } from "./endpoints/EndpointsGraphQLController";
import setupOrganizationsRESTEndpoints from "./endpoints/organization/setupRESTEndpoints";
import { setSocketServer } from "./endpoints/socket/server";
import setupTasksRESTEndpoints from "./endpoints/task/setupRESTEndpoints";
import handleErrors from "./middlewares/handleErrors";
import httpToHttps from "./middlewares/httpToHttps";
import { getAuditLogModel } from "./mongo/audit-log";
import { getBlockModel } from "./mongo/block";
import { getChatModel } from "./mongo/chat";
import { getClientModel } from "./mongo/client";
import { getCollaborationRequestModel } from "./mongo/collaboration-request";
import { getDefaultConnection } from "./mongo/defaultConnection";
import { getRoomModel } from "./mongo/room";
import { getSprintModel } from "./mongo/sprint";
import { getTokenModel } from "./mongo/token";
import { getUnseenChatsModel } from "./mongo/unseen-chats";
import { getUserModel } from "./mongo/user";
import { appVariables } from "./resources/appVariables";
import logger from "./utilities/logger";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://c416dce16a3f4dddab7adf82a64b6227@o881673.ingest.sentry.io/5836122",

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
}

logger.info("server initialization");

const connection = getDefaultConnection();

// TODO: wait for all the other models before opening up the port
const userModel = getUserModel();
const blockModel = getBlockModel();
const auditLogModel = getAuditLogModel();
const chatModel = getChatModel();
const clientModel = getClientModel();
const collaborationRequestModel = getCollaborationRequestModel();
const roomModel = getRoomModel();
const sprintModel = getSprintModel();
const tokenModel = getTokenModel();
const unseenChatsModel = getUnseenChatsModel();

const app = express();
const port = process.env.PORT || 5000;

// TODO: Define better white-listed CORS origins. Maybe from a DB.
const whiteListedCorsOrigins = [/^https?:\/\/www.softkave.com$/];

if (process.env.NODE_ENV !== "production") {
  whiteListedCorsOrigins.push(/localhost/);
}

const corsOption: CorsOptions = {
  origin: whiteListedCorsOrigins,
  optionsSuccessStatus: 200,
  credentials: true,
};

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  path: "/socket",
  serveClient: false,
  cors: corsOption,
});

setSocketServer(io);

if (process.env.NODE_ENV === "production") {
  app.use(httpToHttps);
}

app.use(cors(corsOption));
app.use(
  expressJwt({
    secret: appVariables.jwtSecret,
    credentialsRequired: false,
    algorithms: ["HS256"],
  })
);

app.use(
  bodyParser.json({
    type: "application/json",
  })
);

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: false,
    schema: indexSchema,
    rootValue: getEndpointsGraphQLController(),
  })
);

setupBoardsRESTEndpoints(getBaseContext(), app);
setupCollaborationRequestsRESTEndpoints(getBaseContext(), app);
setupTasksRESTEndpoints(getBaseContext(), app);
setupOrganizationsRESTEndpoints(getBaseContext(), app);
setupCollaboratorsRESTEndpoints(getBaseContext(), app);
app.use(handleErrors);

connection.wait().then(async () => {
  // TODO: move index creation to DB pipeline
  await userModel.waitTillReady();
  await blockModel.waitTillReady();
  await auditLogModel.waitTillReady();
  await chatModel.waitTillReady();
  await clientModel.waitTillReady();
  await collaborationRequestModel.waitTillReady();
  await roomModel.waitTillReady();
  await sprintModel.waitTillReady();
  await tokenModel.waitTillReady();
  await unseenChatsModel.waitTillReady();

  // scripts

  httpServer.listen(port, () => {
    logger.info(appVariables.appName);
    logger.info("server started");
    logger.info("port: " + port);
  });
});

// TODO: consider converting the codebase to use 4 spaces for tab
// for better readability

process.on("uncaughtException", (exp, origin) => {
  // TODO: we changed all logger.error to console.error because
  // we were missing a lot of data, particularly the stack trace with
  // logger.error. Maybe implement a fix for this in winston

  // TODO: the stack trace attached to the error references the compiled
  // .js code. How can we transform it to the .ts code, maybe using
  // the source map?

  // TODO: maybe do the same for the other logger methods, and remember
  // to remove the outputCapture option in vscode's debug config

  // TODO: the problem with using console instead of winston is
  // that we may not be able to persist the logs, like in a db

  // TODO: maybe implement a way for capturing the errors as is,
  // and comparing it with what is logged to see how much data we're missing
  console.error(exp);
  logger.info(origin);
});

process.on("unhandledRejection", (reason, promise) => {
  promise?.catch(logger.info);
  logger.info(reason);
});
