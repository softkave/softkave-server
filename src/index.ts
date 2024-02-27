import * as Sentry from '@sentry/node';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import {expressjwt} from 'express-jwt';
import * as http from 'http';
import {Server} from 'socket.io';
import setupBoardsRESTEndpoints from './endpoints/boards/setupRESTEndpoints';
import setupClientsRESTEndpoints from './endpoints/clients/setupRESTEndpoints';
import setupCollaborationRequestsRESTEndpoints from './endpoints/collaborationRequests/setupRESTEndpoints';
import setupCollaboratorsRESTEndpoints from './endpoints/collaborators/setupRESTEndpoints';
import {getBaseContext} from './endpoints/contexts/BaseContext';
import setupOrganizationsRESTEndpoints from './endpoints/organizations/setupRESTEndpoints';
import setupPermissionsRESTEndpoints from './endpoints/permissions/setupRESTEndpoints';
import setupPushSubscriptionRESTEndpoints from './endpoints/pushSubscription/setupRESTEndpoints';
import {setSocketServer} from './endpoints/socket/server';
import setupSprintsRESTEndpoints from './endpoints/sprints/setupRESTEndpoints';
import setupSystemRESTEndpoints from './endpoints/system/setupRESTEndpoints';
import setupTasksRESTEndpoints from './endpoints/tasks/setupRESTEndpoints';
import setupUserRESTEndpoints from './endpoints/user/setupRESTEndpoints';
import handleErrors from './middlewares/handleErrors';
import httpToHttps from './middlewares/httpToHttps';
import {getDefaultMongoConnection} from './mongo/defaultConnection';
import {appVariables} from './resources/appVariables';
import {script_transformResources} from './scripts/script_transformResources';
import logger from './utilities/logger';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://c416dce16a3f4dddab7adf82a64b6227@o881673.ingest.sentry.io/5836122',

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
}

logger.info('server initialization');

const connection = getDefaultMongoConnection();
const app = express();
const port = process.env.PORT || 5000;

// TODO: Define better white-listed CORS origins. Maybe from a DB.
const whiteListedCorsOrigins = [/^https?:\/\/www.softkave.com$/];

if (process.env.NODE_ENV !== 'production') {
  whiteListedCorsOrigins.push(/localhost/);
}

const corsOption: cors.CorsOptions = {
  origin: whiteListedCorsOrigins,
  optionsSuccessStatus: 200,
  credentials: true,
};

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  path: '/socket',
  serveClient: false,
  cors: corsOption,
});

setSocketServer(io);
if (process.env.NODE_ENV === 'production') {
  app.use(httpToHttps);
}

app.use(cors(corsOption));
app.use(
  expressjwt({
    secret: appVariables.jwtSecret,
    credentialsRequired: false,
    algorithms: ['HS256'],
  })
);

app.use(
  bodyParser.json({
    type: 'application/json',
  })
);

const ctx = getBaseContext();
setupUserRESTEndpoints(ctx, app);
setupBoardsRESTEndpoints(ctx, app);
setupCollaborationRequestsRESTEndpoints(ctx, app);
setupTasksRESTEndpoints(ctx, app);
setupOrganizationsRESTEndpoints(ctx, app);
setupCollaboratorsRESTEndpoints(ctx, app);
setupClientsRESTEndpoints(ctx, app);
setupPushSubscriptionRESTEndpoints(ctx, app);
setupSprintsRESTEndpoints(ctx, app);
setupSystemRESTEndpoints(ctx, app);
setupPermissionsRESTEndpoints(ctx, app);
app.use(handleErrors);

connection.wait().then(async () => {
  // scripts
  await script_transformResources(connection.getConnection());
  // await script_backfillWorkspacePermissions(ctx);

  httpServer.listen(port, () => {
    logger.info(appVariables.appName);
    logger.info('server started');
    logger.info('port: ' + port);
  });
});

// TODO: consider converting the codebase to use 4 spaces for tab
// for better readability

process.on('uncaughtException', (exp, origin) => {
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
  console.log('uncaughtException');
  console.error(exp);
  console.log(origin);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('unhandledRejection');
  console.error(reason);
  process.exit(1);
});
