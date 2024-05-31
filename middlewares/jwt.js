const jwt = require("jsonwebtoken");

let secret_key = process.env.AUTH_SERVER_SECRET;

module.exports = function (req, res, next) {
  let authorization = req.headers.authorization;

  if (authorization) {
    let authorization_header_parts = authorization.split(" ");

    authorization =
      authorization_header_parts[0].toLowerCase() === "bearer"
        ? authorization_header_parts[1]
        : authorization_header_parts[0];

    try {
      let decoded = jwt.verify(authorization, secret_key);

      req.jwt = decoded;

      return next();
    } catch (error) {
      console.error(error);

      return res.status(401).send({
        code: "invalid_token",
      });
    }
  }

  next();
};
