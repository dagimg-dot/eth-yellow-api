const apollo_client = require("../config/apollo");
const { comparePassword } = require("../utils/passwordUtils");
const { createLoginResponse } = require("../utils/response");
const GET_USER = require("../graphql/queries/getUser");
const { generateToken } = require("../utils/tokenUtils");

const updateUserObj = (user, _user) => {
  user.user_id = _user.user_id;
  user.username = _user.username;
  user.first_name = _user.first_name;
  user.last_name = _user.last_name;
};

const login = async (req, res) => {
  const { email, password } = req.body.input.params;

  await new Promise((resolve) => setTimeout(resolve, 3000));

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

    const authFailedResponse = createLoginResponse({
      message: "Login failed",
      errors: [
        {
          message: "Invalid email or password",
          extensions: {
            code: "auth_failed",
          },
        },
      ],
    });

    if (data.users.length === 0) {
      return res.json(authFailedResponse);
    }

    updateUserObj(user, data.users[0]);

    const isCorrect = await comparePassword(password, data.users[0].password);

    if (!isCorrect) {
      return res.json(authFailedResponse);
    }

    const token = generateToken(user);

    res.json(
      createLoginResponse({
        accessToken: token,
        message: "Login successful",
        success: true,
        user,
      })
    );
  } catch (error) {
    console.error(error);
    if (error instanceof ApolloError && error.graphQLErrors.length > 0) {
      return res.json(
        createLoginResponse({
          message: "Something went wrong",
          errors: error.graphQLErrors,
        })
      );
    }

    return res.json(
      createLoginResponse({
        message: "Something went wrong",
        errors: [error],
      })
    );
  }
};

module.exports = login;
