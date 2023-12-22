require("dotenv").config();

const config = {
  app: "employee-management",
  port: process.env.PORT || 8000,
  mongo: {
    uri: process.env.MONGO_URI,
    db: process.env.DB_NAME,
  },
  admin: {
    password: process.env.ADMIN_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};

module.exports = config;
