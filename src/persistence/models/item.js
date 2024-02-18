const mongoose = require("mongoose");

// properties
// {
//   key: "",
//   type: "string/image",
//   value: ""
// }

const itemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
      unique: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    properties: [],
    addedBy: {
      type: String,
      required: true,
    },
    modifiedBy: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("item", itemSchema);
