require("dotenv").config();

const config = {
  app: "carpenter-service",
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
  infobip: {
    apiKey: process.env.INFOBIP_API_KEY,
    baseUrl: process.env.INFOBIP_BASE_URL,
  },
  communication: {
    email: process.env.COMMUNICATION_FROM_EMAIL,
    phone: process.env.COMMUNICATION_FROM_PHONE,
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
};

module.exports = config;
