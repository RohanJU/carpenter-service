const Joi = require("joi");

const validateAddEmployeeRequestBody = (body) => {
  const employeeSchema = Joi.object({
    name: Joi.string().regex(new RegExp("[a-zA-Z][a-zA-Z ]*")),
    email: Joi.string().regex(
      new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$")
    ),
    phone: Joi.string().min(10).max(15).regex(new RegExp("^[0-9]+$")),
    password: Joi.string().min(4).max(8),
    designation: Joi.string().optional(),
    address: Joi.string().optional(),
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
    password: Joi.string().min(4).max(8).optional(),
    address: Joi.string().optional(),
  })
    .min(1)
    .unknown();

  return Joi.attempt(body, employeeSchema);
};

const validateGetEmployeeRequestQuery = (query) => {
  const q = {
    pageNumber:
      query.pageNumber &&
      typeof query.pageNumber === "string" &&
      parseInt(query.pageNumber) > 0
        ? parseInt(query.pageNumber)
        : 1,
    pageSize:
      query.pageSize &&
      typeof query.pageSize === "string" &&
      parseInt(query.pageSize) > 0 &&
      parseInt(query.pageSize) <= 10
        ? parseInt(query.pageSize)
        : 10,
  };

  return q;
};

const validateGetEmployeeBulkRequestBody = (body) => {
  const employeeSchema = Joi.object({
    workerIds: Joi.array().items(Joi.string())
  })
    .unknown();

  return Joi.attempt(body, employeeSchema);
};

module.exports = {
  validateAddEmployeeRequestBody,
  validateUpdateEmployeeRequestBody,
  validateGetEmployeeRequestQuery,
  validateGetEmployeeBulkRequestBody
};
