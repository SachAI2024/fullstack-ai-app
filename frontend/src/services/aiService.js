import React from 'react';
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

// Custom hook for AI provider context
export const useAIProvider = () => {
  const [provider, setProvider] = React.useState('openai');

  const toggleProvider = (newProvider) => {
    if (newProvider && (newProvider === 'openai' || newProvider === 'huggingface')) {
      setProvider(newProvider);
    } else {
      // Toggle between the two providers
      setProvider(prev => prev === 'openai' ? 'huggingface' : 'openai');
    }
  };

  return {
    provider,
    toggleProvider,
    isOpenAI: provider === 'openai',
    isHuggingFace: provider === 'huggingface'
  };
};
