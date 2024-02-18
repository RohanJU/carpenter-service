const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Admin = require("../persistence/models/admin");
const auth = require("../middleware/auth");
const { verify } = require("../utils/encryption");
const config = require("../config");
const { getRandomOTP } = require("../utils");
const { sendOtpOnEmail, sendOtpOnPhone } = require("../libs/communication");
const Otp = require("../persistence/models/otp");

const tokenExpiritionSeconds = 60 * 60;
const isMockOtp = true;
const mockOtp = "1234";

router.post("/otp/send", async (req, res) => {
  try {
    const { email, phone } = req.body;

    const admin = await Admin.findOne({ email, phone });

    if (!admin) {
      return res.status(403).json({
        status: 403,
        message: "Invalid Request",
        data: null,
      });
    }

    const otpForEmail = isMockOtp ? mockOtp : getRandomOTP(4);
    const otpForSMS = isMockOtp ? mockOtp : getRandomOTP(4);

    if (!isMockOtp) {
      await sendOtpOnEmail(admin.email, otpForEmail);
      await sendOtpOnPhone(admin.phone, otpForSMS);
    }

    const otp = new Otp({
      uuid: admin.uuid,
      phoneOtp: otpForSMS,
      emailOtp: otpForEmail,
    });

    await otp.save();

    return res.status(200).json({
      status: 200,
      message: "OTP sent",
      data: {
        email,
        phone,
      },
    });
  } catch (e) {
    console.error(`Error in sending OTP`, e);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
});

router.post("/otp/verify", async (req, res) => {
  try {
    const { email, phone, emailOtp, phoneOtp } = req.body;

    const admin = await Admin.findOne({ email, phone });

    if (!admin) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
        data: null,
      });
    }

    const otp = await Otp.findOne({ uuid: admin.uuid });

    if (emailOtp !== otp.emailOtp || phoneOtp !== otp.phoneOtp) {
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
    console.error(`Error in sending OTP`, e);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const admins = await Admin.find({ $or: [{ email }, { username }] });

    if (admins.length !== 1) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
        data: null,
      });
    }

    const admin = admins[0];

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

router.get("/profile", auth, async (req, res) => {
  try {
    const { email } = req.user;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
        data: null,
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Logged In",
      data: {
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        uuid: admin.uuid,
        username: admin.username,
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
