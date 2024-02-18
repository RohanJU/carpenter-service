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
  },
  { timestamps: true }
);

const Employee = mongoose.model("EMPLOYEE", employeeSchema);
module.exports = Employee;
