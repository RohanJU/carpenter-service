const jwt = require("jsonwebtoken");
const config = require("../config");

function verifyjwt(req, res, next) {
  const tokenWithBearerPrefix = req.headers["authorization"];
  if (
    !typeof tokenWithBearerPrefix === "string" ||
    tokenWithBearerPrefix.split(" ").length < 2
  ) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized",
      data: null,
    });
  }

  const token = tokenWithBearerPrefix.split(" ")[1];

  if (!token)
    return res.status(401).json({
      status: 401,
      message: "Unauthorized",
      data: null,
    });

  try {
    console.log(token);
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (e) {
    console.log(`Error while authenticating`, e);
    return res.status(401).json({
      status: 401,
      message: "Unauthorized",
      data: null,
    });
  }
}

module.exports = verifyjwt;
