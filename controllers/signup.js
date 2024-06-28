const { ApolloError } = require("apollo-boost");
const apollo = require("../config/apollo");
const { encryptPassword } = require("../utils/passwordUtils");
const ADD_USER = require("../graphql/mutations/addUser");
const { createSignupResponse } = require("../utils/response");

const signup = async (req, res) => {
  const { username, email, password, first_name, last_name } =
    req.body.input.params;

  const hashedPassword = await encryptPassword(password);

  const user = {
    username,
    email,
    password: hashedPassword,
    first_name,
    last_name,
  };

  try {
    const { data } = await apollo.mutate({
      mutation: ADD_USER,
      variables: {
        username: user.username,
        email: user.email,
        password: user.password,
        firstname: user.first_name,
        lastname: user.last_name,
      },
    });

    res.json(
      createSignupResponse({
        user_id: data.insert_users_one.user_id,
        message: "Signup successful",
        success: true,
      })
    );
  } catch (error) {
    console.log("Error: ", error);
    if (error instanceof ApolloError && error.graphQLErrors.length > 0) {
      if (error.graphQLErrors[0].extensions.code === "constraint-violation") {
        return res.json(
          createSignupResponse({
            message: "Signup failed",
            errors: [
              {
                message: "User already exists",
                extensions: {
                  code: "user_exists",
                },
              },
            ],
          })
        );
      }

      return res.json(
        createSignupResponse({
          message: "Something went wrong",
          errors: error.graphQLErrors,
        })
      );
    }

    return res.json(
      createSignupResponse({
        message: "Something went wrong",
        errors: [
          {
            message: "Unknown error occurred",
            extensions: {
              message: error.message,
              code: "unknown_error",
            },
          },
        ],
      })
    );
  }
};

module.exports = signup;
