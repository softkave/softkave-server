import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import graphqlHTTP from "express-graphql";
import expressJwt from "express-jwt";
import { IndexOperations, indexSchema } from "./endpoints";
import handleErrors from "./middlewares/handleErrors";
import httpToHttps from "./middlewares/httpToHttps";
import AccessControlModel from "./mongo/access-control/AccessControlModel";
import BlockModel from "./mongo/block/BlockModel";
import connection from "./mongo/defaultConnection";
import NotificationModel from "./mongo/notification/NotificationModel";
import UserModel from "./mongo/user/UserModel";
import appInfo from "./res/appInfo";
// import initTaskCollaborationType from "./scripts/initTaskCollaborationType";

const userModel = new UserModel({ connection: connection.getConnection() });
const blockModel = new BlockModel({ connection: connection.getConnection() });
const notificationModel = new NotificationModel({
  connection: connection.getConnection()
});

const accessControlModel = new AccessControlModel({
  connection: connection.getConnection()
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
  optionsSuccessStatus: 200
};

if (process.env.NODE_ENV === "production") {
  app.use(httpToHttps);
}

app.use(cors(corsOption));
app.use(
  expressJwt({
    secret: JWT_SECRET,
    credentialsRequired: false
  })
);

app.use(
  bodyParser.json({
    type: "application/json"
  })
);

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql,
    schema: indexSchema,
    rootValue: new IndexOperations({
      blockModel,
      notificationModel,
      userModel,
      accessControlModel
    })
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

  // Scripts
  // initTaskCollaborationType();

  app.listen(port, () => {
    console.log(appInfo.appName);
    console.log("server started");
    console.log("port: " + port);
  });
});
