const { v4: uuidv4 } = require("uuid");
const Admin = require("../persistence/models/admin");
const config = require("../config/index");
const { hash } = require("../utils/encryption");
const connectDB = require("../persistence/connectDB");

const admins = [
  {
    uuid: uuidv4(),
    name: "Carpenter",
    email: "admin@carpenter.com",
    username: "admin",
    phone: "9829987420",
    password: config.admin.password,
  },
];

const addAdmin = async (admin) => {
  const passwordHash = await hash(admin.password);

  const newAdmin = new Admin({ ...admin, password: passwordHash });

  await newAdmin.save();
  console.log(`Admin added with data: `, newAdmin);
};

const addAdmins = async (admins) => {
  try {
    for (const admin of admins) {
      await addAdmin(admin);
    }
  } catch (e) {
    console.log(e);
  }
};

const init = async () => {
  await connectDB(config.mongo.uri, config.mongo.db);
  await addAdmins(admins);
};

init().catch(console.error);
