const aws = require("aws-sdk");

aws.config.loadFromPath("./src/res/aws-config.json");

module.exports = aws;
export {};
