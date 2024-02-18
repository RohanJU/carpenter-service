const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const Employee = require("../persistence/models/employee");
const verifyJwt = require("../middleware/auth");
const {
  validateAddEmployeeRequestBody,
  validateUpdateEmployeeRequestBody,
  validateGetEmployeeRequestQuery,
} = require("../validator");
const { hash } = require("../utils/encryption");

router.post("/add-employee", verifyJwt, async (req, res) => {
  try {
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
      },
    });
  } catch (e) {
    console.error(`Error in post employee`, e);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
});

router.get("/get-employee", verifyJwt, async (req, res) => {
  try {
    const { skip, limit } = validateGetEmployeeRequestQuery(req.query);
    const employees = await Employee.find().skip(skip).limit(limit);

    return res.status(200).json({
      status: 200,
      data: employees.map((employee) => {
        return {
          uuid: employee.uuid,
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          designation: employee.designation,
          address: employee.address,
        };
      }),
    });
  } catch (e) {
    console.error(`Error in get employees`, e);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
});

router.get("/:id", verifyJwt, async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    return res.status(200).json({
      status: 200,
      data: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        designation: employee.designation,
        salary: employee.salary,
      },
    });
  } catch (e) {
    console.error(`Error in get employee by id`, e);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
});

router.patch("/:id", verifyJwt, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, designation, salary } =
      validateUpdateEmployeeRequestBody(req.body);

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

    if (salary) {
      updateObj["salary"] = salary;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(id, updateObj, {
      new: true,
    });
    return res.status(200).json({
      status: 200,
      data: {
        id: updatedEmployee.id,
        name: updatedEmployee.name,
        phone: updatedEmployee.phone,
        designation: updatedEmployee.designation,
        salary: updatedEmployee.salary,
      },
      message: "Employee Details Updated Successfully!",
    });
  } catch (e) {
    console.error(`Error in update employee by id`, e);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
});

router.delete("/:id", verifyJwt, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEmployee = await Employee.findByIdAndDelete(id);
    return res.status(200).json({
      status: 200,
      message: "Employee Deleted Successfully!",
    });
  } catch (e) {
    console.log(`Error deleting the employee`, e);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
});

module.exports = router;
