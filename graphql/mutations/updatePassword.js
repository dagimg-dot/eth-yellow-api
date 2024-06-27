const gql = require("graphql-tag");

const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($user_id: uuid!, $password: String!) {
    update_users_by_pk(
      pk_columns: { user_id: $user_id }
      _set: { password: $password }
    ) {
      user_id
    }
  }
`;

module.exports = UPDATE_PASSWORD;
