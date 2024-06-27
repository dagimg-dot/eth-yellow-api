const gql = require("graphql-tag");

const GET_PASSWORD = gql`
  query ($user_id: uuid!) {
    users_by_pk(user_id: $user_id) {
      password
    }
  }
`;

module.exports = GET_PASSWORD;
