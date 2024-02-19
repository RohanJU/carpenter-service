const AWS = require('aws-sdk');
const config = require('../config');

const sns = new AWS.SNS({
    region: config.aws.region,
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
});

const sendSMS = (phoneNumber, message) => {
    const params = {
        PhoneNumber: phoneNumber,
        Message: message
    };

    return sns.publish(params).promise();
};

module.exports = {
    sendSMS
};