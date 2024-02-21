const Joi = require("joi");

const validateAddOrderRequestBody = (body) => {
  const orderSchema = Joi.object({
    customerName: Joi.string().regex(new RegExp("[a-zA-Z][a-zA-Z ]*")),
    visitTime: Joi.number(),
    phone: Joi.string().min(10).max(15).regex(new RegExp("^[0-9]+$")),
    address: Joi.string().optional(),
    workers: Joi.array().items({ workerId: Joi.string() }).optional(),
    items: Joi.array().items({ workerId: Joi.string() }).optional(),
  }).unknown();

  return Joi.attempt(body, orderSchema);
};

const validateUpdateOrderRequestBody = (body) => {
  const orderSchema = Joi.object({
    customerName: Joi.string()
      .regex(new RegExp("[a-zA-Z][a-zA-Z ]*"))
      .optional(),
    visitTime: Joi.number().optional(),
    phone: Joi.string()
      .min(10)
      .max(15)
      .regex(new RegExp("^[0-9]+$"))
      .optional(),
    address: Joi.string().optional(),
    workers: Joi.array().items({ workerId: Joi.string() }).optional(),
    items: Joi.array().items({ workerId: Joi.string() }).optional(),
    status: Joi.string()
      .valid("PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED")
      .optional(),
  })
    .min(1)
    .unknown();

  return Joi.attempt(body, orderSchema);
};

const validateGetOrderRequestQuery = (query) => {
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
    status: query.status,
  };

  return q;
};

module.exports = {
  validateAddOrderRequestBody,
  validateUpdateOrderRequestBody,
  validateGetOrderRequestQuery,
};
