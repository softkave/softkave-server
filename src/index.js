require("dotenv").config();

const { connection } = require("./mongo/connection");
const userModel = require("./mongo/user").model;
const blockModel = require("./mongo/block").model;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const graphqlHTTP = require("express-graphql");
const expressJwt = require("express-jwt");
const path = require("path");
const { buildSchema } = require("graphql");
const { utilitySchema } = require("./schema-utils");
const { blockSchema, blockHandlerGraphql } = require("./block");
const { userHandlerGraphql, userSchema } = require("./user");
const collaborationRequestModel = require("../src/mongo/collaboration-request");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not present");
}

const rootSchema = buildSchema(`
  ${utilitySchema}
  ${userSchema}
  ${blockSchema}

  type Query {
    user: UserQuery
    block: BlockQuery
  }

  type Mutation {
    user: UserQuery
    block: BlockQuery
  }
`);

const root = {
  user: userHandlerGraphql,
  block: blockHandlerGraphql
};

let app = express();
const port = process.env.PORT || 5000;
const corsOption = {
  origin: [/^http:\/\/localhost:3000.*$/, /^.*/],
  optionsSuccessStatus: 200
};

app.use(cors(corsOption));
if (process.env.NODE_ENV !== "development") {
  app.use(function(req, res, next) {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect(["https://", req.get("Host"), req.url].join(""));
    }

    return next();
  });
}

app.use(express.static(path.join(__dirname, "../build")));
app.use(bodyParser.json({ type: "application/json" }));
app.use(
  expressJwt({
    secret: JWT_SECRET,
    credentialsRequired: false
  })
);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: rootSchema,
    rootValue: root,
    graphiql: !!process.env.DEVELOPMENT
  })
);

app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res
      .status(200)
      .send({ errors: [{ field: "user", message: "invalid credentials" }] });
  } else {
    res.status(401).send({
      errors: [{ field: "error", message: "server error" }]
    });
  }

  console.error(err);
});

app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

connection.once("open", async () => {
  await userModel.init();
  await blockModel.init();
  await collaborationRequestModel.init();

  app.listen(port, () => {
    console.log("server started");
    console.log("port: " + port);
  });
});
