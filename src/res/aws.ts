const aws = require("aws-sdk");

aws.config.loadFromPath("./src/res/aws-config.json");

export default aws;
