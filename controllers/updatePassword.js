const { ApolloError } = require("apollo-boost");
const apollo_client = require("../config/apollo");
const GET_PASSWORD = require("../graphql/queries/getPassword");
const UPDATE_PASSWORD = require("../graphql/mutations/updatePassword");
const { comparePassword, encryptPassword } = require("../utils/passwordUtils");
const { createUpdatePasswordResponse } = require("../utils/response");

const internalErrorResponse = createUpdatePasswordResponse({
  message: "Something went wrong",
  errors: [
    {
      message: "Something went wrong",
      extensions: {
        code: "internal_error",
      },
    },
  ],
});

const persistPassword = async (userId, newPassword) => {
  const newHashedPassword = await encryptPassword(newPassword);

  try {
    await apollo_client.mutate({
      mutation: UPDATE_PASSWORD,
      variables: {
        user_id: userId,
        password: newHashedPassword,
      },
    });

    return true;
  } catch (error) {
    return false;
  }
};

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body.input.params;
  const userId = req.jwt.sub;

  try {
    const { data } = await apollo_client.query({
      query: GET_PASSWORD,
      variables: {
        user_id: userId,
      },
    });

    const notFoundResponse = createUpdatePasswordResponse({
      message: "User not found",
      errors: [
        {
          message: "User not found",
          extensions: {
            code: "user_not_found",
          },
        },
      ],
    });

    if (data.users_by_pk === null) {
      return res.json(notFoundResponse);
    }

    const user = data.users_by_pk;

    const isCorrect = await comparePassword(currentPassword, user.password);

    if (!isCorrect) {
      return res.json(
        createUpdatePasswordResponse({
          message: "Invalid password",
          errors: [
            {
              message: "Invalid password",
              extensions: {
                code: "invalid_password",
              },
            },
          ],
        })
      );
    }

    const isPersisted = await persistPassword(userId, newPassword);

    if (!isPersisted) {
      return res.json(internalErrorResponse);
    }

    return res.json(
      createUpdatePasswordResponse({
        success: true,
        message: "Password updated successfully",
      })
    );
  } catch (error) {
    if (error instanceof ApolloError && error.graphQLErrors.length > 0) {
      return res.json(
        createUpdatePasswordResponse({
          message: "Something went wrong",
          errors: error.graphQLErrors,
        })
      );
    }

    res.json(internalErrorResponse);
  }
};

module.exports = updatePassword;
