const Joi = require("joi");

const validateAddItemRequestBody = (body) => {
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

const validateGetItemRequestQuery = (query) => {
  const q = {
    skip:
      query.skip && typeof query.skip === "string" && parseInt(query.skip) > 0
        ? parseInt(query.skip)
        : 0,
    limit:
      query.limit &&
      typeof query.limit === "string" &&
      parseInt(query.limit) > 0 &&
      parseInt(query.limit) < 10
        ? parseInt(query.limit)
        : 10,
    status: query.status,
  };

  return q;
};

module.exports = {
  validateAddItemRequestBody,
  validateUpdateOrderRequestBody,
  validateGetItemRequestQuery,
};
