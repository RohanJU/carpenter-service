const AWS = require("aws-sdk");
const config = require("../config");

const ses = new AWS.SES({
  region: config.aws.region,
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
});

const sendEmail = (to, subject, body) => {
  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Text: {
          Data: body,
        },
      },
      Subject: {
        Data: subject,
      },
    },
    Source: config.communication.email,
  };

  return ses.sendEmail(params).promise();
};

module.exports = {
  sendEmail,
};
