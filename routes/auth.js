const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Admin = require("../persistence/models/admin");
const Employee = require("../persistence/models/employee");
const { verify } = require("../utils/encryption");
const config = require("../config");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
        data: null,
      });
    }

    const isValid = await verify(password, admin.password);

    if (!isValid) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
        data: null,
      });
    }

    const token = jwt.sign(
      {
        email,
      },
      config.jwt.secret,
      {
        expiresIn: Math.floor(Date.now() / 1000) + 60 * 60,
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

module.exports = router;
