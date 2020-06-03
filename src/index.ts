import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import graphqlHTTP from "express-graphql";
import expressJwt from "express-jwt";
// import multer from "multer";
// import multerS3 from "multer-s3";
// import { nanoid } from "nanoid";
import { indexSchema } from "./endpoints";
import { getEndpointController } from "./endpoints/controller";
import handleErrors from "./middlewares/handleErrors";
import httpToHttps from "./middlewares/httpToHttps";
import { getAuditLogModel } from "./mongo/audit-log";
import { getBlockModel } from "./mongo/block";
import { getDefaultConnection } from "./mongo/defaultConnection";
import { getNotificationModel } from "./mongo/notification";
import { getUserModel } from "./mongo/user";
import appInfo from "./res/appInfo";
import block_v3 from "./scripts/block_v3";
import { oldNotificationToNewNotification } from "./scripts/notification_v2";
import { oldUserToNewUser } from "./scripts/user_v2";
// import aws from "./res/aws";

console.log("server initialization");

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
// const whiteListedCorsOrigins = [];
let graphiql = false;

if (process.env.NODE_ENV !== "production") {
  whiteListedCorsOrigins.push(/localhost/);
  graphiql = true;
}

const corsOption = {
  origin: whiteListedCorsOrigins,
  optionsSuccessStatus: 200,
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
//   console.dir({ req });
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
    rootValue: getEndpointController(),
  })
);

app.use(handleErrors);

connection.wait().then(async () => {
  // TODO: move index creation to DB pipeline

  await userModel.waitTillReady();
  await blockModel.waitTillReady();
  await notificationModel.waitTillReady();
  await auditLogModel.waitTillReady();

  // scripts
  // await block_v3();
  // await oldNotificationToNewNotification();
  await oldUserToNewUser();

  app.listen(port, () => {
    console.log(appInfo.appName);
    console.log("server started");
    console.log("port: " + port);
  });
});
