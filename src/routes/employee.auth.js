const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Employee = require("../persistence/models/employee");
const { verify } = require("../utils/encryption");
const config = require("../config");
const verifyjwt = require("../middleware/auth");
const allowedRoles = require("../middleware/allowedRoles");

const tokenExpiritionSeconds = 7 * 24 * 60 * 60;

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
        data: null,
      });
    }

    const isValid = await verify(password, employee.password);

    if (!isValid) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
        data: null,
      });
    }

    const token = jwt.sign(
      {
        uuid: employee.uuid,
        verificationTokenType: "ACCESS_TOKEN",
        role: "EMPLOYEE"
      },
      config.jwt.secret,
      {
        expiresIn: Math.floor(Date.now() / 1000) + tokenExpiritionSeconds,
      }
    );

    return res.status(200).json({
      status: 200,
      message: "Logged In",
      data: {
        token,
      },
    });
  } catch (e) {
    console.error(`Error in logging in`, e);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
});

router.get("/profile", verifyjwt, allowedRoles(['EMPLOYEE']), async (req, res) => {
  try {
    const { uuid } = req.user;

    const employee = await Employee.findOne({ uuid });

    if (!employee) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
        data: null,
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Profile",
      data: {
        uuid: employee.uuid,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        designation: employee.designation,
        address: employee.address,
      },
    });
  } catch (e) {
    console.error(`Error in fetching profile`, e);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
});

module.exports = router;
