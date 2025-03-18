import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/client';
import AIToggle from './components/AIToggle';
import DataDisplay from './components/DataDisplay';
import QueryForm from './components/QueryForm';
import { useAIProvider } from './context/AIProviderContext';
import { GET_DATA, POPULATE_DATA } from './services/aiService';
import './App.css';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 1rem;
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
`;

function App() {
  const [query, setQuery] = useState('');
  const { provider, toggleProvider } = useAIProvider();
  
  // Query for data with provider parameter
  const { loading, error, data, refetch } = useQuery(GET_DATA, {
    variables: { query, provider },
    skip: !query, // Skip the query if no query string is provided
  });

  // Mutation to populate data with provider parameter
  const [populateData, { loading: populateLoading }] = useMutation(POPULATE_DATA);

  // Handle form submission
  const handleSubmit = async (queryText: string) => {
    setQuery(queryText);
    try {
      const result = await refetch({ query: queryText, provider });
      
      // If no data is found, trigger the populate data mutation
      if (!result.data.getData || result.data.getData.length === 0) {
        await populateData({ 
          variables: { query: queryText, provider },
          onCompleted: () => {
            // Refetch data after population
            refetch({ query: queryText, provider });
          }
        });
      }
    } catch (err) {
      console.error('Error fetching or populating data:', err);
    }
  };

  // Handle AI provider toggle
  const handleToggleChange = (newProvider: string) => {
    toggleProvider(newProvider);
    
    // Refetch data with new provider if there's an active query
    if (query) {
      refetch({ query, provider: newProvider });
    }
  };

  return (
    <AppContainer>
      <Header>
        <Title>GraphQL Data Explorer</Title>
        <AIToggle 
          activeProvider={provider} 
          onToggle={handleToggleChange} 
        />
      </Header>

      <QueryForm onSubmit={handleSubmit} />
      
      <DataDisplay 
        data={data?.getData} 
        loading={loading || populateLoading} 
        error={error} 
        aiProvider={provider}
      />
    </AppContainer>
  );
}

export default App;
