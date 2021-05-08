import bodyParser from "body-parser";
import cors, { CorsOptions } from "cors";
import express from "express";
import graphqlHTTP from "express-graphql";
import expressJwt from "express-jwt";
import http from "http";
// import aws from "./res/aws";
import { Server } from "socket.io";
// import multer from "multer";
// import multerS3 from "multer-s3";
// import { nanoid } from "nanoid";
import { indexSchema } from "./endpoints";
import { getEndpointsGraphQLController } from "./endpoints/EndpointsGraphQLController";
import { setupSocketServer } from "./endpoints/socket/server";
import handleErrors from "./middlewares/handleErrors";
import httpToHttps from "./middlewares/httpToHttps";
import { getAuditLogModel } from "./mongo/audit-log";
import { getBlockModel } from "./mongo/block";
import { getDefaultConnection } from "./mongo/defaultConnection";
import { getNotificationModel } from "./mongo/notification";
import { getUserModel } from "./mongo/user";
import appInfo from "./resources/appInfo";
import logger from "./utilities/logger";

logger.info("server initialization");

const connection = getDefaultConnection();
const userModel = getUserModel();
const blockModel = getBlockModel();
const notificationModel = getNotificationModel();
const auditLogModel = getAuditLogModel();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not present");
}

const app = express();
const port = process.env.PORT || 5000;

// TODO: Define better white-listed CORS origins. Maybe from a DB.
const whiteListedCorsOrigins = [/^https?:\/\/www.softkave.com$/];
const graphiql = false;

if (process.env.NODE_ENV !== "production") {
    whiteListedCorsOrigins.push(/localhost/);
}

const corsOption: CorsOptions = {
    origin: whiteListedCorsOrigins,
    optionsSuccessStatus: 200,
    credentials: true,
};

if (process.env.NODE_ENV === "production") {
    app.use(httpToHttps);
}

app.use(cors(corsOption));

app.use(
    expressJwt({
        secret: JWT_SECRET,
        credentialsRequired: false,
    })
);

// 3 months in secs -- 60 secs * 60 mins * 24 hours * 30 days * 3 months
// const maxAge = 60 * 60 * 24 * 30 * 3;

// // 5 mb in bytes -- 1024 bytes * 1024 kb * 5 mb
// const maxFileSize = 1024 * 1024 * 5;
// const s3 = new aws.S3();
// const multerS3Storage = multerS3({
//   s3,
//   bucket:
//     process.env.NODE_ENV === "production"
//       ? "softkave-files"
//       : "softkave-files-dev",
//   acl: "private",
//   cacheControl: `max-age=${maxAge}`,
//   contentType: multerS3.AUTO_CONTENT_TYPE,
//   key(req, file, cb) {
//     const fileKey = file.filename + `-${nanoid()}`;
//     cb(null, fileKey);
//   },
// });

// const upload = multer({
//   storage: multerS3Storage,
//   limits: {
//     fileSize: maxFileSize,
//   },
// });

// app.post("/upload", upload.array("files", 5), (req, res, next) => {
//   // req.files is array of `photos` files
//   // req.body will contain the text fields, if there were any
// });

app.use(
    bodyParser.json({
        type: "application/json",
    })
);

app.use(
    "/graphql",
    graphqlHTTP({
        graphiql,
        schema: indexSchema,
        rootValue: getEndpointsGraphQLController(),
    })
);

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    path: "/socket",
    serveClient: false,
    cors: {
        origin: whiteListedCorsOrigins,
        methods: ["GET", "POST"],
    },
});

setupSocketServer(io);
app.use(handleErrors);

connection.wait().then(async () => {
    // TODO: move index creation to DB pipeline
    await userModel.waitTillReady();
    await blockModel.waitTillReady();
    await notificationModel.waitTillReady();
    await auditLogModel.waitTillReady();

    // scripts

    httpServer.listen(port, () => {
        logger.info(appInfo.appName);
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
    logger.info(promise);
    logger.info(reason);
});
