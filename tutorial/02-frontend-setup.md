<!--
Author: Sach-AI llc California
Email: Sach.ai@outlook.com
-->

# Frontend Setup and Development

This section of the tutorial covers setting up the React frontend application with Apollo Client for GraphQL integration and creating the necessary components for our application.

## Setting Up the Frontend Project

### Step 1: Create the Frontend Directory Structure

First, let's create the directory structure for our frontend application:

```bash
mkdir -p frontend/src/components frontend/src/services frontend/src/context
```

### Step 2: Initialize the Frontend Package

Create a `package.json` file for the frontend:

```bash
cd frontend
npm init -y
```

### Step 3: Install Frontend Dependencies

Install the necessary dependencies for our React application:

```bash
npm install react react-dom react-scripts @apollo/client graphql styled-components
npm install --save-dev typescript @types/react @types/react-dom @types/styled-components
```

### Step 4: Configure TypeScript

Create a `tsconfig.json` file in the frontend directory:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

## Creating the Frontend Components

Now let's create the necessary components for our application.

### Step 1: Create the Entry Point (index.tsx)

Create `src/index.tsx` with Apollo Client configuration:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import App from './App';
import { AIProviderProvider } from './context/AIProviderContext';
import './index.css';

// Create an HTTP link to the GraphQL server
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

// Create the Apollo Client
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

// Render the app
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AIProviderProvider>
        <App />
      </AIProviderProvider>
    </ApolloProvider>
  </React.StrictMode>
);
```

### Step 2: Create Basic CSS Styles

Create `src/index.css` for basic styling:

```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f9f9f9;
  color: #333;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

* {
  box-sizing: border-box;
}
```

### Step 3: Create the AI Provider Context

Create `src/context/AIProviderContext.js` to manage the AI provider state:

```tsx
import React, { useState, createContext, useContext } from 'react';

// Create context for AI provider
const AIProviderContext = createContext({
  provider: 'openai',
  toggleProvider: () => {},
  isOpenAI: true,
  isHuggingFace: false
});

// Provider component
export const AIProviderProvider = ({ children }) => {
  const [provider, setProvider] = useState('openai');

  const toggleProvider = (newProvider) => {
    if (newProvider && (newProvider === 'openai' || newProvider === 'huggingface')) {
      setProvider(newProvider);
    } else {
      // Toggle between the two providers
      setProvider(prev => prev === 'openai' ? 'huggingface' : 'openai');
    }
  };

  const value = {
    provider,
    toggleProvider,
    isOpenAI: provider === 'openai',
    isHuggingFace: provider === 'huggingface'
  };

  return (
    <AIProviderContext.Provider value={value}>
      {children}
    </AIProviderContext.Provider>
  );
};

// Hook to use the AI provider context
export const useAIProvider = () => {
  const context = useContext(AIProviderContext);
  if (context === undefined) {
    throw new Error('useAIProvider must be used within an AIProviderProvider');
  }
  return context;
};
```

### Step 4: Create GraphQL Service

Create `src/services/aiService.js` with GraphQL queries and mutations:

```tsx
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
```

### Step 5: Create the Main App Component

Create `src/App.tsx` as the main component:

```tsx
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
```

### Step 6: Create App CSS

Create `src/App.css` for additional styling:

```css
.App {
  text-align: center;
}

h1, h2, h3, h4, h5, h6 {
  color: #333;
}

h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 0.5rem;
}

p {
  line-height: 1.6;
}

button {
  cursor: pointer;
}

/* Animation for loading states */
@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

.loading-pulse {
  animation: pulse 1.5s infinite ease-in-out;
}
```

## Creating UI Components

Now let's create the individual UI components for our application.

### Step 1: Create the AI Toggle Component

Create `src/components/AIToggle.tsx`:

```tsx
import React from 'react';
import styled from 'styled-components';
import { useAIProvider } from '../context/AIProviderContext';

interface AIToggleProps {
  activeProvider: string;
  onToggle: (provider: string) => void;
}

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 30px;
  padding: 4px;
  width: 240px;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 25px;
  background-color: ${props => props.active ? '#4285f4' : 'transparent'};
  color: ${props => props.active ? 'white' : '#333'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#4285f4' : '#e0e0e0'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.3);
  }
`;

const AIToggle: React.FC<AIToggleProps> = ({ activeProvider, onToggle }) => {
  return (
    <ToggleContainer>
      <ToggleButton 
        active={activeProvider === 'openai'} 
        onClick={() => onToggle('openai')}
      >
        OpenAI
      </ToggleButton>
      <ToggleButton 
        active={activeProvider === 'huggingface'} 
        onClick={() => onToggle('huggingface')}
      >
        HuggingFace
      </ToggleButton>
    </ToggleContainer>
  );
};

export default AIToggle;
```

### Step 2: Create the Query Form Component

Create `src/components/QueryForm.tsx`:

```tsx
import React from 'react';
import styled from 'styled-components';

interface QueryFormProps {
  onSubmit: (query: string) => void;
}

const FormContainer = styled.div`
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Arial', sans-serif;
  font-size: 1rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #4285f4;
    box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.3);
  }
`;

const SubmitButton = styled.button`
  align-self: flex-end;
  padding: 0.75rem 1.5rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #3367d6;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.3);
  }
`;

const QueryForm: React.FC<QueryFormProps> = ({ onSubmit }) => {
  const [queryText, setQueryText] = React.useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryText.trim()) {
      onSubmit(queryText.trim());
    }
  };
  
  return (
    <FormContainer>
      <h2>Enter Your Query</h2>
      <Form onSubmit={handleSubmit}>
        <TextArea
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          placeholder="Enter your query here..."
          aria-label="Query input"
        />
        <SubmitButton type="submit">Submit Query</SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default QueryForm;
```

### Step 3: Create the Data Display Component

Create `src/components/DataDisplay.tsx`:

```tsx
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
```

## Summary

In this section, we've set up the frontend project structure and created all the necessary components for our React application. We've implemented:

1. The project structure with TypeScript configuration
2. Apollo Client integration for GraphQL
3. React Context for managing the AI provider state
4. UI components for the query form, data display, and AI provider toggle

In the next section, we'll set up the backend GraphQL server to handle our data requests and integrate with AI services.
