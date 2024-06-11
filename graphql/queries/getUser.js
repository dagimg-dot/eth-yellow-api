const gql = require("graphql-tag");

const GET_USER = gql`
  query ($email: String!) {
    users(where: { email: { _eq: $email } }) {
      user_id
      password
      username
      first_name
      last_name
    }
  }
`;

module.exports = GET_USER;