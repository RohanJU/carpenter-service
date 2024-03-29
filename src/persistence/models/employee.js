const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
    },
    address: {
      type: String,
    },
    addedBy: {
      type: String,
      required: true,
    },
    modifiedBy: [],
    status: {
      type: String,
      enum: ["ACTIVE", "DELETED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model("employee", employeeSchema);
module.exports = Employee;
