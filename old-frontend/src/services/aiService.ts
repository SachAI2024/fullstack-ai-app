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

// Define the type for our AI provider
export type AIProvider = 'openai' | 'huggingface';

// Define the return type for our hook
export interface AIProviderHookResult {
  provider: AIProvider;
  toggleProvider: (newProvider?: AIProvider) => void;
  isOpenAI: boolean;
  isHuggingFace: boolean;
}

// Custom hook for AI provider context
export const useAIProvider = (): AIProviderHookResult => {
  const [provider, setProvider] = React.useState<AIProvider>('openai');

  const toggleProvider = (newProvider?: AIProvider): void => {
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
