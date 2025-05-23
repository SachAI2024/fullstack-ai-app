import { gql } from '@apollo/client';

// GraphQL query with provider parameter
export const GET_DATA = gql`
  query GetData($query: String!, $provider: String) {
    getData(query: $query, provider: $provider) {
      id
      title
      content
      source
    }
  }
`;

// GraphQL mutation with provider parameter
export const POPULATE_DATA = gql`
  mutation PopulateData($query: String!, $provider: String) {
    populateData(query: $query, provider: $provider) {
      success
      message
    }
  }
`;
