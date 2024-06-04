const { ApolloError } = require("apollo-boost");
const apollo = require("../config/apollo");
const gql = require("graphql-tag");
const { encryptPassword } = require("../utils/passwordUtils");

const ADD_USER = gql`
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
`;

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

    res.status(200).json({
      success: true,
      message: "User created successfully",
      errors: null,
      user_id: data.insert_users_one.user_id,
    });
  } catch (error) {
    if (error instanceof ApolloError && error.graphQLErrors.length > 0) {
      return res.json({
        success: false,
        message: "Error",
        errors: error.graphQLErrors,
        user_id: null,
      });
    }

    return res.json({
      errors: {
        success: false,
        message: "Error",
        errors: [error],
        user_id: null,
      },
    });
  }
};

module.exports = signup;
