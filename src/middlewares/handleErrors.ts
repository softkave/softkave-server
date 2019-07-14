const {
  credentialsExpiredError,
  serverError,
  invalidCredentialsError
} = require("../utils/error");

function handleErrors(err, req, res) {
  if (err.name === "UnauthorizedError") {
    res.status(200).send({
      errors: [invalidCredentialsError]
    });
  } else if (err.name === "TokenExpiredError") {
    res.status(200).send({
      errors: [credentialsExpiredError]
    });
  } else {
    res.status(500).send({
      errors: [serverError]
    });
  }

  console.error(err);
}

module.exports = handleErrors;
export {};
