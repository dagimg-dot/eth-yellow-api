const jwt = require("jsonwebtoken");
const { createUpdatePasswordResponse } = require("../utils/response");

let secret_key = process.env.JWT_SECRET_KEY;

const authenticateToken = (req, res, next) => {
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
      return res.send(
        createUpdatePasswordResponse({
          message: "Invalid token",
          errors: [
            {
              message: "Invalid token",
              extensions: {
                code: "invalid_token",
              },
            },
          ],
        })
      );
    }
  } else {
    return res.send(
      createUpdatePasswordResponse({
        message: "No token provided",
        errors: [
          {
            message: "No token provided",
            extensions: {
              code: "no_token",
            },
          },
        ],
      })
    );
  }

  next();
};

module.exports = authenticateToken;
