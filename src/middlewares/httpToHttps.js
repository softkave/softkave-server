function httpToHttps(req, res, next) {
  if (req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect(["https://", req.get("Host"), req.url].join(""));
  }

  return next();
}

module.exports = httpToHttps;
