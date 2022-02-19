import aws from "aws-sdk";

aws.config.loadFromPath("./aws-config.json");

export default aws;
