const getEmailOtpSubjectAndBody = (otp) => {
  return {
    subject: "Carpenter OTP",
    body: `This is your OTP to reset password, OTP: ${otp}`,
  };
};

const getSMSOtpSubjectAndBody = (otp) => {
  return {
    body: `This is your OTP to reset password, OTP: ${otp}`,
  };
};

module.exports = {
  getEmailOtpSubjectAndBody,
  getSMSOtpSubjectAndBody,
};
