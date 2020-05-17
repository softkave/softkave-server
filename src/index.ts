import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import graphqlHTTP from "express-graphql";
import expressJwt from "express-jwt";
// import multer from "multer";
// import multerS3 from "multer-s3";
// import { nanoid } from "nanoid";
import { EndpointController, indexSchema } from "./endpoints";
import handleErrors from "./middlewares/handleErrors";
import httpToHttps from "./middlewares/httpToHttps";
import BlockModel from "./mongo/block/BlockModel";
import connection from "./mongo/defaultConnection";
import NotificationModel from "./mongo/notification/NotificationModel";
import UserModel from "./mongo/user/UserModel";
import appInfo from "./res/appInfo";
// import aws from "./res/aws";

const userModel = new UserModel({ connection: connection.getConnection() });
const blockModel = new BlockModel({ connection: connection.getConnection() });
const notificationModel = new NotificationModel({
  connection: connection.getConnection(),
});

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
    rootValue: new EndpointController({
      blockModel,
      notificationModel,
      userModel,
    }),
  })
);

app.use(handleErrors);

connection.wait().then(async () => {
  // TODO: move index creation to DB pipeline
  // TODO: should we move to createIndex?
  // although createIndex most likely creates the indexes all over again, find out more, to be sure.
  await userModel.model.ensureIndexes();
  await blockModel.model.ensureIndexes();
  await notificationModel.model.ensureIndexes();

  // scripts

  app.listen(port, () => {
    console.log(appInfo.appName);
    console.log("server started");
    console.log("port: " + port);
  });
});
