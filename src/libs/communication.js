const config = require("../config");
const { Infobip, AuthType } = require("@infobip-api/sdk");
const {
  getEmailOtpSubjectAndBody,
  getSMSOtpSubjectAndBody,
} = require("../utils/communication");

const infobip = new Infobip({
  baseUrl: config.infobip.baseUrl,
  apiKey: config.infobip.apiKey,
  authType: AuthType.ApiKey,
});

const sendOtpOnEmail = async (email, otp) => {
  console.log(`Sending OTP on email: ${email}`);

  const content = getEmailOtpSubjectAndBody(otp);

  const response = await infobip.channels.email.send({
    to: email,
    from: `Tests <${config.communication.email}>`,
    subject: content.subject,
    text: content.body,
  });

  console.log(JSON.stringify(response.data));
};

const sendOtpOnPhone = async (phone, otp) => {
  const content = getSMSOtpSubjectAndBody(otp);
  const response = await infobip.channels.sms.send({
    type: "text",
    messages: [
      {
        destinations: [
          {
            to: phone,
          },
        ],
        from: config.communication.phone,
        text: content.body,
      },
    ],
  });

  console.log(JSON.stringify(response.data));
};

module.exports = {
  sendOtpOnEmail,
  sendOtpOnPhone,
};
