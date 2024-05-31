const ApolloClient = require("apollo-boost").ApolloClient;
const createHttpLink = require("apollo-link-http").createHttpLink;
const InMemoryCache = require("apollo-cache-inmemory").InMemoryCache;
const fetch = require("cross-fetch/polyfill").fetch;

console.log("hasura graphql url: ",process.env.HASURA_GRAPHQL_URL);

const apollo_client = new ApolloClient({
  link: createHttpLink({
    uri: process.env.HASURA_GRAPHQL_URL,
    fetch: fetch,
    headers: {
      "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET,
    },
  }),
  cache: new InMemoryCache({
    addTypename: false,
  }),
});

module.exports = apollo_client;
