const { ApolloError } = require("apollo-boost");
const apollo_client = require("../config/apollo");
const gql = require("graphql-tag");
const { comparePassword } = require("../utils/passwordUtils");
const jwt = require("jsonwebtoken");

const GET_USER = gql`
  query ($email: String!) {
    users(where: { email: { _eq: $email } }) {
      user_id
      password
      username
    }
  }
`;

const updateUserObj = (user, _user) => {
  user.user_id = _user.user_id;
  user.username = _user.username;
};

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

const login = async (req, res) => {
  const { email, password } = req.body.input.params;

  const user = {
    user_id: null,
    username: null,
    email,
  };

  try {
    const { data } = await apollo_client.query({
      query: GET_USER,
      variables: {
        email: user.email,
      },
    });

    if (data.users.length === 0) {
      return res.json({
        success: false,
        message: "User not found",
        errors: null,
      });
    }

    updateUserObj(user, data.users[0]);

    const isCorrect = await comparePassword(password, data.users[0].password);

    if (!isCorrect) {
      return res.json({
        success: false,
        message: "Invalid email or password",
        errors: null,
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      errors: null,
      message: "You are successfully logged in",
      accessToken: token,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof ApolloError && error.graphQLErrors.length > 0) {
      return res.json({
        success: false,
        message: "Error",
        errors: error.graphQLErrors,
      });
    }

    return res.json({
      errors: {
        success: false,
        message: "Error",
        errors: [error],
      },
    });
  }
};

module.exports = login;
