const Joi = require("joi");

const validateAddEmployeeRequestBody = (body) => {
  const employeeSchema = Joi.object({
    name: Joi.string().regex(new RegExp("[a-zA-Z][a-zA-Z ]*")),
    email: Joi.string().regex(
      new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$")
    ),
    phone: Joi.string().min(10).max(15).regex(new RegExp("^[0-9]+$")),
    designation: Joi.string(),
    salary: Joi.string().regex(
      new RegExp("^(?!0+(?:\\.0+)?$)[0-9]+(?:\\.[0-9]+)?$")
    ),
  }).unknown();

  return Joi.attempt(body, employeeSchema);
};

const validateUpdateEmployeeRequestBody = (body) => {
  const employeeSchema = Joi.object({
    name: Joi.string().regex(new RegExp("[a-zA-Z][a-zA-Z ]*")).optional(),
    email: Joi.string()
      .regex(new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$"))
      .optional(),
    phone: Joi.string()
      .min(10)
      .max(15)
      .regex(new RegExp("^[0-9]+$"))
      .optional(),
    designation: Joi.string().optional(),
    salary: Joi.string()
      .regex(new RegExp("^(?!0+(?:\\.0+)?$)[0-9]+(?:\\.[0-9]+)?$"))
      .optional(),
  })
    .min(1)
    .unknown();

  return Joi.attempt(body, employeeSchema);
};

module.exports = {
  validateAddEmployeeRequestBody,
  validateUpdateEmployeeRequestBody,
};
