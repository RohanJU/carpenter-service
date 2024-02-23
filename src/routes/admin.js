const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const Employee = require("../persistence/models/employee");
const verifyJwt = require("../middleware/auth");
const {
  validateAddEmployeeRequestBody,
  validateUpdateEmployeeRequestBody,
  validateGetEmployeeRequestQuery,
} = require("../validator/admin");
const { hash } = require("../utils/encryption");
const allowedRoles = require("../middleware/allowedRoles");

router.post(
  "/add-employee",
  verifyJwt,
  allowedRoles(["ADMIN"]),
  async (req, res) => {
    try {
      const adminUuid = req.user.uuid;
      const { name, email, phone, password, designation, address } =
        validateAddEmployeeRequestBody(req.body);

      const passwordHash = await hash(password);

      const newEployee = new Employee({
        uuid: uuidv4(),
        name,
        email,
        phone,
        password: passwordHash,
        designation,
        address,
        addedBy: adminUuid,
      });

      await newEployee.save();

      return res.status(201).json({
        status: 201,
        message: "Employee added",
        data: {
          uuid: newEployee.uuid,
          name,
          email,
          phone,
          designation,
          address,
          addedBy: req.user.uuid,
          modifiedBy: [],
        },
      });
    } catch (e) {
      console.error(`Error in post employee`, e);

      if (e.name === "ValidationError") {
        const message = e.message || "Bad request";
        return res.status(400).json({
          status: 400,
          message: message.split(":")[0],
          data: null,
        });
      }

      return res.status(500).json({
        status: 500,
        message: "Internal server error",
        data: null,
      });
    }
  }
);

router.get(
  "/get-employee",
  verifyJwt,
  allowedRoles(["ADMIN"]),
  async (req, res) => {
    try {
      const { pageNumber, pageSize } = validateGetEmployeeRequestQuery(
        req.query
      );

      const filter = { status: "ACTIVE" };
      const skip = (pageNumber - 1) * pageSize;
      const limit = pageSize;

      const totalCount = await Employee.countDocuments(filter);
      const employees = await Employee.find(filter).skip(skip).limit(limit);

      return res.status(200).json({
        status: 200,
        data: {
          pageNumber,
          pageSize,
          totalCount,
          employees: employees.map((employee) => {
            return {
              uuid: employee.uuid,
              name: employee.name,
              email: employee.email,
              phone: employee.phone,
              designation: employee.designation,
              address: employee.address,
              addedBy: employee.addedBy,
              modifiedBy: employee.modifiedBy,
            };
          }),
        },
      });
    } catch (e) {
      console.error(`Error in get employees`, e);

      if (e.name === "ValidationError") {
        const message = e.message || "Bad request";
        return res.status(400).json({
          status: 400,
          message: message.split(":")[0],
          data: null,
        });
      }

      return res.status(500).json({
        status: 500,
        message: "Internal server error",
        data: null,
      });
    }
  }
);

router.get(
  "/get-employee/:uuid",
  verifyJwt,
  allowedRoles(["ADMIN"]),
  async (req, res) => {
    try {
      const { uuid } = req.params;
      const employee = await Employee.findOne({ uuid, status: "ACTIVE" });

      if (!employee) {
        return res.status(404).json({
          status: 404,
          message: "Not Found",
          data: null,
        });
      }

      return res.status(200).json({
        status: 200,
        data: {
          uuid: employee.uuid,
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          designation: employee.designation,
          address: employee.address,
          addedBy: employee.addedBy,
          modifiedBy: employee.modifiedBy,
        },
      });
    } catch (e) {
      console.error(`Error in get employee by id`, e);

      if (e.name === "ValidationError") {
        const message = e.message || "Bad request";
        return res.status(400).json({
          status: 400,
          message: message.split(":")[0],
          data: null,
        });
      }

      return res.status(500).json({
        status: 500,
        message: "Internal server error",
        data: null,
      });
    }
  }
);

router.patch(
  "/update-employee/:uuid",
  verifyJwt,
  allowedRoles(["ADMIN"]),
  async (req, res) => {
    try {
      const adminUuid = req.user.uuid;
      const { uuid } = req.params;
      const { name, email, phone, designation, address, password } =
        validateUpdateEmployeeRequestBody(req.body);

      const employee = await Employee.findOne({ uuid });

      if (!employee) {
        return res.status(404).json({
          status: 404,
          message: "Not Found",
          data: null,
        });
      }

      const updateObj = {};

      if (name) {
        updateObj["name"] = name;
      }

      if (email) {
        updateObj["email"] = email;
      }

      if (phone) {
        updateObj["phone"] = phone;
      }

      if (designation) {
        updateObj["designation"] = designation;
      }

      if (address) {
        updateObj["address"] = salary;
      }

      if (password) {
        const passwordHash = await hash(password);
        updateObj["password"] = passwordHash;
      }

      const modifiedBy = employee.modifiedBy;
      modifiedBy.push(adminUuid);

      updateObj["modifiedBy"] = modifiedBy;

      const updatedEmployee = await Employee.findOneAndUpdate(
        { uuid },
        updateObj,
        { new: true }
      );
      return res.status(200).json({
        status: 200,
        data: {
          uuid: updatedEmployee.uuid,
          name: updatedEmployee.name,
          phone: updatedEmployee.phone,
          designation: updatedEmployee.designation,
          address: updatedEmployee.address,
          addedBy: updatedEmployee.addedBy,
          modifiedBy: updatedEmployee.modifiedBy,
        },
        message: "Employee Details Updated Successfully!",
      });
    } catch (e) {
      console.error(`Error in update employee by id`, e);

      if (e.name === "ValidationError") {
        const message = e.message || "Bad request";
        return res.status(400).json({
          status: 400,
          message: message.split(":")[0],
          data: null,
        });
      }

      return res.status(500).json({
        status: 500,
        message: "Internal server error",
        data: null,
      });
    }
  }
);

router.delete(
  "/delete-employee/:uuid",
  verifyJwt,
  allowedRoles(["ADMIN"]),
  async (req, res) => {
    try {
      const adminUuid = req.user.uuid;
      const { uuid } = req.params;

      const filter = { uuid, status: "ACTIVE" };

      const employee = await Employee.findOne(filter);

      if (!employee) {
        return res.status(404).json({
          status: 404,
          message: "Not Found",
          data: null,
        });
      }

      const modifiedBy = employee.modifiedBy;
      modifiedBy.push(adminUuid);

      const updateObj = {
        status: "INACTIVE",
        uuid: `${uuidv4().substring(0, 5)}.DEL.${employee.uuid}`,
        email: `${uuidv4().substring(0, 5)}.DEL.${employee.email}`,
        phone: `${uuidv4().substring(0, 5)}.DEL.${employee.phone}`,
        modifiedBy: modifiedBy,
      };

      await Employee.updateOne(filter, updateObj);

      return res.status(200).json({
        status: 200,
        message: "Employee Deleted Successfully!",
      });
    } catch (e) {
      console.log(`Error deleting the employee`, e);

      if (e.name === "ValidationError") {
        const message = e.message || "Bad request";
        return res.status(400).json({
          status: 400,
          message: message.split(":")[0],
          data: null,
        });
      }

      return res.status(500).json({
        status: 500,
        message: "Internal server error",
        data: null,
      });
    }
  }
);

module.exports = router;
