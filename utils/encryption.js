const bcrypt = require("bcrypt");

const hash = (data) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(data, 10, (err, h) => {
      if (err) {
        return reject(err);
      }

      return resolve(h);
    });
  });
};

const verify = (data, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(data, hash, (err, isSame) => {
      if (err) {
        return reject(err);
      }

      return resolve(isSame === true);
    });
  });
};

module.exports = {
  hash,
  verify,
};
