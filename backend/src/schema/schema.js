const { gql } = require('apollo-server-express');

// Define GraphQL schema
const typeDefs = gql`
  # Data type returned from queries
  type DataItem {
    id: ID!
    title: String!
    content: String!
    source: String!
    timestamp: String
  }

  # Response type for data population
  type PopulateResponse {
    success: Boolean!
    message: String
  }

  # Query type
  type Query {
    # Get data based on query string
    getData(query: String!, provider: String): [DataItem]
  }

  # Mutation type
  type Mutation {
    # Populate data if not available
    populateData(query: String!, provider: String): PopulateResponse
  }
`;

module.exports = typeDefs;
