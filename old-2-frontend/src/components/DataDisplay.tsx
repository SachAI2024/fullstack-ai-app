import React from 'react';
import styled from 'styled-components';

interface DataItem {
  id: string;
  title: string;
  content: string;
  source: string;
}

interface DataDisplayProps {
  data: DataItem[] | null | undefined;
  loading: boolean;
  error: any;
  aiProvider: string;
}

const DisplayContainer = styled.div`
  margin-top: 2rem;
`;

const LoadingMessage = styled.div`
  padding: 2rem;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 4px;
  color: #666;
`;

const ErrorMessage = styled.div`
  padding: 2rem;
  text-align: center;
  background-color: #fff0f0;
  border-radius: 4px;
  color: #d32f2f;
`;

const NoDataMessage = styled.div`
  padding: 2rem;
  text-align: center;
  background-color: #f5f5f5;
  border-radius: 4px;
  color: #666;
`;

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const DataCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div<{ provider: string }>`
  padding: 1rem;
  background-color: ${props => props.provider === 'openai' ? '#10a37f' : '#ffbd59'};
  color: white;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
`;

const CardSource = styled.div`
  font-size: 0.8rem;
  margin-top: 0.5rem;
  opacity: 0.8;
`;

const CardContent = styled.div`
  padding: 1rem;
  color: #333;
`;

const ProviderBadge = styled.span<{ provider: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  margin-top: 0.5rem;
  background-color: ${props => props.provider === 'openai' ? 'rgba(16, 163, 127, 0.1)' : 'rgba(255, 189, 89, 0.1)'};
  color: ${props => props.provider === 'openai' ? '#10a37f' : '#ff9800'};
`;

const DataDisplay: React.FC<DataDisplayProps> = ({ data, loading, error, aiProvider }) => {
  if (loading) {
    return <LoadingMessage>Loading data...</LoadingMessage>;
  }
  
  if (error) {
    return <ErrorMessage>Error: {error.message}</ErrorMessage>;
  }
  
  if (!data || data.length === 0) {
    return <NoDataMessage>No data available. Try submitting a query.</NoDataMessage>;
  }
  
  return (
    <DisplayContainer>
      <h2>Results</h2>
      <DataGrid>
        {data.map((item) => (
          <DataCard key={item.id}>
            <CardHeader provider={aiProvider}>
              <CardTitle>{item.title}</CardTitle>
              <CardSource>Source: {item.source}</CardSource>
            </CardHeader>
            <CardContent>
              <p>{item.content}</p>
              <ProviderBadge provider={aiProvider}>
                {aiProvider === 'openai' ? 'OpenAI' : 'HuggingFace'}
              </ProviderBadge>
            </CardContent>
          </DataCard>
        ))}
      </DataGrid>
    </DisplayContainer>
  );
};

export default DataDisplay;
