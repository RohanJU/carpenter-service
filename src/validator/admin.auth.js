const Joi = require("joi");

const validateAdminAuthSendOtpRequestBody = (body) => {
  const employeeSchema = Joi.object({
    email: Joi.string().regex(
      new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$")
    ),
    phone: Joi.string().min(10).max(15).regex(new RegExp("^[0-9]+$")),
  }).unknown();

  return Joi.attempt(body, employeeSchema);
};

const validateAdminAuthVerifyOtpRequestBody = (body) => {
  const employeeSchema = Joi.object({
    email: Joi.string().regex(
      new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$")
    ),
    phone: Joi.string().min(10).max(15).regex(new RegExp("^[0-9]+$")),
    emailOtp: Joi.string(),
    phoneOtp: Joi.string(),
  }).unknown();

  return Joi.attempt(body, employeeSchema);
};

const validateAdminAuthResetPasswordRequestBody = (body) => {
  const employeeSchema = Joi.object({
    password: Joi.string().min(4).max(8),
  }).unknown();

  return Joi.attempt(body, employeeSchema);
};

const validateAdminAuthLoginRequestBody = (body) => {
  const employeeSchema = Joi.object({
    email: Joi.string().regex(
      new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$")
    ),
    username: Joi.string(),
    password: Joi.string().min(4).max(8),
  }).unknown();

  return Joi.attempt(body, employeeSchema);
};

module.exports = {
  validateAdminAuthSendOtpRequestBody,
  validateAdminAuthVerifyOtpRequestBody,
  validateAdminAuthResetPasswordRequestBody,
  validateAdminAuthLoginRequestBody,
};
