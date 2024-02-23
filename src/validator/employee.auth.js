const Joi = require("joi");

const validateEmployeeAuthLoginRequestBody = (body) => {
  const employeeSchema = Joi.object({
    email: Joi.string().regex(
      new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$")
    ),
    password: Joi.string().min(4).max(8),
  }).unknown();

  return Joi.attempt(body, employeeSchema);
};

module.exports = {
    validateEmployeeAuthLoginRequestBody
}
