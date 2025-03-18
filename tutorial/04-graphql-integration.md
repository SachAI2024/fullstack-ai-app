<!--
Author: Sach-AI llc California
Email: Sach.ai@outlook.com
-->

# GraphQL Integration

This section of the tutorial focuses on the GraphQL integration between the frontend and backend, explaining how data flows through the application and how the GraphQL schema, resolvers, and data sources work together.

## Understanding GraphQL in Our Application

GraphQL serves as the communication layer between our React frontend and Node.js backend. It provides a flexible and efficient way to request exactly the data we need and handle mutations to update data.

### GraphQL Architecture Overview

Here's how GraphQL fits into our application architecture:

1. **Frontend**: Uses Apollo Client to send queries and mutations to the backend
2. **Backend**: Uses Apollo Server to process these requests and return data
3. **Data Sources**: Provide methods to fetch data from various sources
4. **Resolvers**: Map GraphQL operations to data source methods

## GraphQL Schema Deep Dive

Let's take a closer look at our GraphQL schema:

```graphql
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
```

### Schema Breakdown:

1. **DataItem Type**: Represents the data structure returned by our queries
   - `id`: Unique identifier for the item
   - `title`: Title of the data item
   - `content`: Main content text
   - `source`: Where the data came from (e.g., "OpenAI", "HuggingFace", "Native System")
   - `timestamp`: When the data was created

2. **PopulateResponse Type**: Represents the response from data population mutations
   - `success`: Whether the operation was successful
   - `message`: Additional information about the operation

3. **Query Type**: Defines available queries
   - `getData`: Takes a query string and optional provider parameter, returns an array of DataItems

4. **Mutation Type**: Defines available mutations
   - `populateData`: Takes a query string and optional provider parameter, triggers data population

## GraphQL Resolvers Explained

Resolvers are functions that resolve the values for fields in our schema. Let's examine our resolver implementation:

```javascript
const resolvers = {
  Query: {
    // Resolver for getData query
    getData: async (_, { query, provider = 'openai' }, { dataSources }) => {
      try {
        // Use the enhanced data API to fetch data with fallback mechanism
        const data = await dataSources.dataAPI.fetchData(query);
        
        // If data exists, return it
        if (data && data.length > 0) {
          // Update the local dataStore with the fetched data
          const existingIds = new Set(dataStore.map(item => item.id));
          const newData = data.filter(item => !existingIds.has(item.id));
          
          if (newData.length > 0) {
            dataStore = [...dataStore, ...newData];
          }
          
          return data;
        }
        
        // If no data exists, process the query with the specified AI provider
        console.log(`No data found for query: ${query}. Processing with ${provider}...`);
        const aiResponse = await aiServiceFactory.processQuery(query, provider);
        
        // Convert AI response to DataItem format if needed
        const aiData = Array.isArray(aiResponse) ? aiResponse : [aiResponse];
        
        // Add to dataStore
        dataStore = [...dataStore, ...aiData];
        
        return aiData;
      } catch (error) {
        console.error("Error in getData resolver:", error);
        throw new Error(`Failed to fetch data: ${error.message}`);
      }
    }
  },
  
  Mutation: {
    // Resolver for populateData mutation
    populateData: async (_, { query, provider = 'openai' }, { dataSources }) => {
      try {
        // Clear the cache to force data population
        dataSources.dataAPI.clearCache();
        
        // Try to fetch data from native system module first
        let data = await dataSources.dataAPI.fetchData(query);
        
        // If no data from native system, use AI provider
        if (!data || data.length === 0) {
          console.log(`No data from native system for query: ${query}. Using ${provider}...`);
          const aiResponse = await aiServiceFactory.processQuery(query, provider);
          
          // Convert AI response to DataItem format if needed
          data = Array.isArray(aiResponse) ? aiResponse : [aiResponse];
          
          // Add to dataStore
          dataStore = [...dataStore, ...data];
        }
        
        if (data && data.length > 0) {
          return {
            success: true,
            message: `Successfully populated ${data.length} items using ${provider}`
          };
        } else {
          return {
            success: false,
            message: "No data could be populated"
          };
        }
      } catch (error) {
        console.error("Error populating data:", error);
        return {
          success: false,
          message: `Error: ${error.message}`
        };
      }
    }
  }
};
```

### Resolver Breakdown:

1. **getData Resolver**:
   - Takes a query string and optional provider parameter
   - Uses the DataAPI to fetch data with fallback mechanisms
   - If data exists, returns it directly
   - If no data exists, uses the AI service to process the query
   - Updates the local data store with new data

2. **populateData Resolver**:
   - Takes a query string and optional provider parameter
   - Clears the cache to force data population
   - Tries to fetch data from the native system module
   - If no data is available, uses the AI service
   - Returns a success/failure response with a message

## Data Sources and Data Flow

Our application uses a custom DataAPI class that extends Apollo's RESTDataSource. This class handles data fetching with multiple fallback mechanisms:

```javascript
class DataAPI extends RESTDataSource {
  constructor() {
    super();
    // Initialize the native system module
    this.nativeSystemModule = new NativeSystemModule();
    // In-memory cache for data
    this.cache = new Map();
  }

  // Method to fetch data based on query
  async fetchData(query) {
    try {
      // Normalize the query for consistent caching
      const normalizedQuery = query.toLowerCase().trim();
      
      // Check if data exists in cache
      if (this.cache.has(normalizedQuery)) {
        console.log(`Data found in GraphQL cache for query: ${query}`);
        return this.cache.get(normalizedQuery);
      }
      
      // Check if data exists in native system module
      const hasNativeData = await this.nativeSystemModule.hasData(normalizedQuery);
      if (hasNativeData) {
        console.log(`Data found in native system module for query: ${query}`);
        const nativeData = await this.nativeSystemModule.getData(normalizedQuery);
        
        // Cache the data for future requests
        this.cache.set(normalizedQuery, nativeData);
        
        return nativeData;
      }
      
      // If no data exists anywhere, trigger the native system module to populate data
      console.log(`No data found for query: ${query}. Triggering native system module...`);
      const populatedData = await this.nativeSystemModule.populateData(normalizedQuery);
      
      // Cache the populated data
      this.cache.set(normalizedQuery, populatedData);
      
      return populatedData;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error('Failed to fetch data from external source');
    }
  }

  // Method to clear cache for testing
  clearCache() {
    this.cache.clear();
  }
}
```

### Data Flow Sequence:

1. **Frontend sends a GraphQL query** with a query string and provider parameter
2. **Apollo Server receives the query** and calls the appropriate resolver
3. **Resolver calls the DataAPI's fetchData method**
4. **DataAPI checks for data in this order**:
   - In-memory cache
   - Native system module
   - If not found, triggers the native system module to populate data
   - If still not available, falls back to AI services
5. **Data is returned to the resolver**, which formats it and returns it to the client
6. **Apollo Client receives the data** and updates the UI

## Frontend GraphQL Integration

On the frontend, we use Apollo Client to send GraphQL queries and mutations. Here's how we define them:

```javascript
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

And here's how we use them in our App component:

```javascript
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
```

## Apollo Server Setup

Our Apollo Server is set up in the `server.js` file:

```javascript
// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      dataAPI: new DataAPI(),
    };
  },
  context: () => {
    return {
      // Add any context values here
    };
  },
});

// Start Apollo Server
await server.start();

// Apply middleware to Express
server.applyMiddleware({ app });
```

This setup:
1. Provides the GraphQL schema (typeDefs)
2. Provides the resolvers
3. Sets up the data sources
4. Configures any context values
5. Applies the Apollo Server middleware to our Express app

## Testing GraphQL Queries

When the server is running, you can test GraphQL queries using the GraphQL Playground available at `http://localhost:4000/graphql`. Here are some example queries:

### Query Data:

```graphql
query {
  getData(query: "technology trends", provider: "openai") {
    id
    title
    content
    source
  }
}
```

### Populate Data:

```graphql
mutation {
  populateData(query: "artificial intelligence", provider: "huggingface") {
    success
    message
  }
}
```

## Summary

In this section, we've explored the GraphQL integration in our application:

1. We've examined the GraphQL schema that defines our data types, queries, and mutations
2. We've analyzed the resolvers that handle these operations
3. We've looked at the data sources and data flow through the application
4. We've seen how the frontend uses Apollo Client to interact with the GraphQL API
5. We've reviewed the Apollo Server setup and how to test GraphQL queries

In the next section, we'll focus on the AI integration with OpenAI and HuggingFace.
