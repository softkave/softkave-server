const { connection } = require("./mongo/connection");
const userModel = require("./mongo/user");
const blockModel = require("./mongo/block");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const graphqlHTTP = require("express-graphql");
const expressJwt = require("express-jwt");
const notificationModel = require("../src/mongo/notification");
const { indexSchema, IndexOperations } = require("./endpoints");
const httpToHttps = require("./middlewares/httpToHttps");
const handleErrors = require("./middlewares/handleErrors");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not present");
}

let app = express();
const port = process.env.PORT || 5000;
const whiteListedCorsOrigins = [/^https:\/\/www.softkave.com$/];
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
      userModel
    })
  })
);

app.use(handleErrors);

connection.once("open", async () => {
  await userModel.model.init();
  await blockModel.model.init();
  await notificationModel.model.init();

  app.listen(port, () => {
    console.log("SOFTKAVE");
    console.log("server started");
    console.log("port: " + port);
  });
});
