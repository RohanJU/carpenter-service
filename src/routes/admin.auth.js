const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Admin = require("../persistence/models/admin");
const auth = require("../middleware/auth");
const { verify, hash } = require("../utils/encryption");
const config = require("../config");
const { getRandomOTP } = require("../utils");
const { redisClient } = require("../persistence/connectRedis");
const verifyjwt = require("../middleware/auth");
const { sendEmail } = require("../libs/SES");
const { sendSMS } = require("../libs/SNS");
const allowedRoles = require("../middleware/allowedRoles");
const {
  validateAdminAuthSendOtpRequestBody,
  validateAdminAuthVerifyOtpRequestBody,
  validateAdminAuthResetPasswordRequestBody,
  validateAdminAuthLoginRequestBody,
} = require("../validator/admin.auth");

const tokenExpiritionSeconds = 60 * 60;
const isMockOtp = true;
const mockOtp = "1234";
const REDIS_TTL_SECONDS = 60;

router.post("/otp/send", async (req, res) => {
  try {
    const { email, phone } = validateAdminAuthSendOtpRequestBody(req.body);

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
      const sesResponse = await sendEmail(
        email,
        `Carpenter`,
        `Your OTP: ${otpForEmail}`
      );
      const snsResponse = await sendSMS(phone, `Your OTP: ${otpForSMS}`);
    }

    const smsKey = `${admin.uuid}_SMS_OTP`;
    const emailKey = `${admin.uuid}_EMAIL_OTP`;

    await redisClient.set(smsKey, otpForSMS, {
      EX: REDIS_TTL_SECONDS,
    });

    await redisClient.set(emailKey, otpForEmail, {
      EX: REDIS_TTL_SECONDS,
    });

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
      message: e.message || "Internal server error",
      data: null,
    });
  }
});

router.post("/otp/verify", async (req, res) => {
  try {
    const { email, phone, emailOtp, phoneOtp } =
      validateAdminAuthVerifyOtpRequestBody(req.body);

    const admin = await Admin.findOne({ email, phone });

    if (!admin) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
        data: null,
      });
    }

    const smsKey = `${admin.uuid}_SMS_OTP`;
    const emailKey = `${admin.uuid}_EMAIL_OTP`;

    const smsOtpStored = await redisClient.get(smsKey);
    const emailOtpStored = await redisClient.get(emailKey);

    if (emailOtp !== emailOtpStored || phoneOtp !== smsOtpStored) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
        data: null,
      });
    }

    const token = jwt.sign(
      {
        uuid: admin.uuid,
        verificationTokenType: "PASSWORD_RESET_TOKEN",
        role: "ADMIN",
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
      message: e.message || "Internal server error",
      data: null,
    });
  }
});

router.post(
  "/password/reset",
  verifyjwt,
  allowedRoles(["ADMIN"]),
  async (req, res) => {
    try {
      const { uuid, verificationTokenType } = req.user;
      const { password } = validateAdminAuthResetPasswordRequestBody(req.body);

      if (verificationTokenType !== "PASSWORD_RESET_TOKEN") {
        return res.status(401).json({
          status: 401,
          message: "Unauthorized",
          data: null,
        });
      }

      const admin = await Admin.findOne({ uuid });

      if (!admin) {
        return res.status(401).json({
          status: 401,
          message: "Unauthorized",
          data: null,
        });
      }

      const passwordHash = await hash(password);

      await Admin.updateOne({ uuid }, { password: passwordHash });

      return res.status(200).json({
        status: 200,
        message: "Password Reseted",
      });
    } catch (e) {
      console.error(`Error in sending OTP`, e);

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
        message: e.message || "Internal server error",
        data: null,
      });
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const { email, username, password } = validateAdminAuthLoginRequestBody(
      req.body
    );

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
        uuid: admin.uuid,
        verificationTokenType: "ACCESS_TOKEN",
        role: "ADMIN",
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
      message: e.message || "Internal server error",
      data: null,
    });
  }
});

router.get("/profile", auth, allowedRoles(["ADMIN"]), async (req, res) => {
  try {
    const { uuid } = req.user;

    const admin = await Admin.findOne({ uuid });

    if (!admin) {
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
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        uuid: admin.uuid,
        username: admin.username,
      },
    });
  } catch (e) {
    console.error(`Error in fetching profile`, e);

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
      message: e.message || "Internal server error",
      data: null,
    });
  }
});

module.exports = router;
