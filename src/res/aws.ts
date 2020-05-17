import aws from "aws-sdk";

aws.config.loadFromPath("./src/res/aws-config.json");

export default aws;
