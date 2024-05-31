const { ApolloError } = require("apollo-boost");
const apollo_client = require("../config/apollo");
const gql = require("graphql-tag");
const { encryptPassword } = require("../utils/passwordUtils");

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
    const { data, errors } = await apollo_client.mutate({
      mutation: gql`
        mutation (
          $username: String!
          $email: String!
          $password: String!
          $firstname: String!
          $lastname: String!
        ) {
          insert_users_one(
            object: {
              username: $username
              email: $email
              password: $password
              first_name: $firstname
              last_name: $lastname
            }
          ) {
            user_id
          }
        }
      `,
      variables: {
        username: user.username,
        email: user.email,
        password: user.password,
        firstname: user.first_name,
        lastname: user.last_name,
      },
    });

    res.status(200).json({
      user_id: data.insert_users_one.user_id,
    });
  } catch (error) {
    if (error instanceof ApolloError && error.graphQLErrors.length > 0) {
      return res.json({
        errors: {
          message: "Error",
          errors: error.graphQLErrors,
        },
      });
    }
  }
};

module.exports = signup;
