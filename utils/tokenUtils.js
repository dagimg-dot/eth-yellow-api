const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    const hasura_token = {
      sub: user.user_id,
      username: user.username,
      iat: Date.now() / 1000,
      iss: user.username,
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": ["user", "anonymous"],
        "x-hasura-user-id": "" + user.user_id,
        "x-hasura-username": "" + user.username,
        "x-hasura-default-role": ["user", "anonymous"],
      },
      exp: Math.floor(Date.now() / 1000) + 28800,
    };
  
    const accessToken = jwt.sign(hasura_token, process.env.JWT_SECRET_KEY, {
      algorithm: "HS256",
    });
  
    return accessToken;
  };

module.exports = { generateToken };