const { connection } = require("./mongo/connection");
const userModel = require("./mongo/user").model;
const blockModel = require("./mongo/block").model;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const graphqlHTTP = require("express-graphql");
const expressJwt = require("express-jwt");
const notificationModel = require("../src/mongo/notification").model;
const { indexSchema, IndexOperations } = require("./endpoints");
const httpToHttps = require("./middlewares/httpToHttps");
const handleErrors = require("./middlewares/handleErrors");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not present");
}

let app = express();
const port = process.env.PORT || 5000;
const whiteListedCorsOrigins = [/www.softkave.com/];
const graphiql = false;

if (process.env.NODE_ENV !== "production") {
  whiteListedCorsOrigins.push(/^localhost.*/);
  graphiql = true;
}

const corsOption = {
  origin: whiteListedCorsOrigins,
  optionsSuccessStatus: 200
};

app.use(cors(corsOption));

if (process.env.NODE_ENV !== "production") {
  app.use(httpToHttps);
}

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
  await userModel.init();
  await blockModel.init();
  await notificationModel.init();

  app.listen(port, () => {
    console.log("SOFTKAVE");
    console.log("server started");
    console.log("port: " + port);
  });
});
