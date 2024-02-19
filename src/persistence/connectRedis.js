const { createClient } = require("redis");
const config = require("../config");

const client = createClient({
  password: config.redis.password,
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
});

const connectRedis = async () => {
  await client.connect();
};

module.exports = {
  connectRedis,
  redisClient: client,
};
