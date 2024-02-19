const Joi = require("joi");

const validateAddItemRequestBody = (body) => {
  const orderSchema = Joi.object({
    itemName: Joi.string(),
    properties: Joi.array()
      .items({ key: Joi.string(), value: Joi.string() })
      .empty(),
  }).unknown();

  return Joi.attempt(body, orderSchema);
};

const validateUpdateItemRequestBody = (body) => {
  const orderSchema = Joi.object({
    itemNameName: Joi.string().optional(),
    properties: Joi.array()
      .items({ key: Joi.string(), value: Joi.string() })
      .empty()
      .optional(),
  })
    .min(1)
    .unknown();

  return Joi.attempt(body, orderSchema);
};

module.exports = {
  validateAddItemRequestBody,
  validateUpdateItemRequestBody,
};
