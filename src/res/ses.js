const aws = require('./aws');

let ses = new aws.SES();

module.exports = {
  ses,
  async sendMail(data) {
    return await ses.sendEmail(data).promise();
  }
};