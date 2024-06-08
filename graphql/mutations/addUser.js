const gql = require("graphql-tag");

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

module.exports = ADD_USER;
