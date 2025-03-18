<!--
Author: Sach-AI llc California
Email: Sach.ai@outlook.com
-->

# Backend Setup and Development

This section of the tutorial covers setting up the Node.js backend with Express and Apollo Server for GraphQL integration.

## Setting Up the Backend Project

### Step 1: Create the Backend Directory Structure

First, let's create the directory structure for our backend application:

```bash
mkdir -p backend/src/schema backend/src/resolvers backend/src/datasources backend/src/services
```

### Step 2: Initialize the Backend Package

Create a `package.json` file for the backend:

```bash
cd backend
npm init -y
```

### Step 3: Install Backend Dependencies

Install the necessary dependencies for our GraphQL server:

```bash
npm install express apollo-server-express graphql mongoose cors uuid
npm install openai @huggingface/inference
npm install --save-dev nodemon
```

## Creating the Backend Server

Now let's create the necessary files for our GraphQL server.

### Step 1: Create the Server Entry Point

Create `src/server.js` as the main entry point:

```javascript
// Script to test the backend server
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const typeDefs = require('./schema/schema');
const resolvers = require('./resolvers/resolvers');
const DataAPI = require('./datasources/dataAPI');

// Import uuid package for generating IDs
const { v4: uuidv4 } = require('uuid');

async function startServer() {
  // Create Express application
  const app = express();
  
  // Enable CORS
  app.use(cors());
  
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
  
  // Define port
  const PORT = process.env.PORT || 4000;
  
  // Start Express server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`GraphQL Playground available at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// Start the server
startServer().catch(error => {
  console.error('Error starting server:', error);
});
```

### Step 2: Create the GraphQL Schema

Create `src/schema/schema.js` to define our GraphQL types, queries, and mutations:

```javascript
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
```

### Step 3: Create the Native System Module

Create `src/datasources/nativeSystemModule.js` to simulate a native system module for data population:

```javascript
// Native system module simulator for data population
class NativeSystemModule {
  constructor() {
    this.dataStore = new Map();
  }

  // Method to check if data exists for a query
  async hasData(query) {
    return this.dataStore.has(query.toLowerCase());
  }

  // Method to get data for a query
  async getData(query) {
    return this.dataStore.get(query.toLowerCase()) || [];
  }

  // Method to populate data for a query
  async populateData(query) {
    console.log(`Native system module populating data for query: ${query}`);
    
    // Simulate data population process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate some mock data
    const data = this.generateMockData(query);
    
    // Store the data
    this.dataStore.set(query.toLowerCase(), data);
    
    return data;
  }

  // Helper method to generate mock data
  generateMockData(query) {
    const categories = ['research', 'article', 'report', 'analysis', 'study'];
    const data = [];
    
    // Generate 3-7 items
    const count = Math.floor(Math.random() * 5) + 3;
    
    for (let i = 0; i < count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      data.push({
        id: `native-${Date.now()}-${i}`,
        title: `${query} ${category} ${i + 1}`,
        content: `This is native system generated content for "${query}". This data was populated by the native system module because it wasn't available in the GraphQL cache.`,
        source: 'Native System Module',
        timestamp: new Date().toISOString()
      });
    }
    
    return data;
  }
}

module.exports = NativeSystemModule;
```

### Step 4: Create the Data API

Create `src/datasources/dataAPI.js` to handle data fetching with fallback mechanisms:

```javascript
// Enhanced data API with native system module integration
const { RESTDataSource } = require('apollo-datasource-rest');
const { v4: uuidv4 } = require('uuid');
const NativeSystemModule = require('./nativeSystemModule');

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

module.exports = DataAPI;
```

### Step 5: Create the GraphQL Resolvers

Create `src/resolvers/resolvers.js` to implement the resolver functions:

```javascript
// Mock database for storing data
let dataStore = [];

// Resolvers define how to fetch the types defined in the schema
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

module.exports = resolvers;
```

## Setting Up Package Scripts

Update the `package.json` file in the backend directory to include useful scripts:

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "GraphQL server with OpenAI and HuggingFace integration",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "@huggingface/inference": "^2.6.1",
    "apollo-datasource-rest": "^3.7.0",
    "apollo-server-express": "^3.13.0",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "graphql": "^16.8.0",
    "mongoose": "^7.5.0",
    "openai": "^4.0.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## Setting Up Root Package Scripts

Create a `package.json` file in the root directory to run both frontend and backend:

```json
{
  "name": "fullstack-app",
  "version": "1.0.0",
  "description": "Full Stack Application with React, GraphQL, OpenAI and HuggingFace",
  "main": "index.js",
  "scripts": {
    "start:backend": "cd backend && node src/server.js",
    "start:frontend": "cd frontend && npm start",
    "start": "concurrently \"npm run start:backend\" \"npm run start:frontend\"",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "react",
    "graphql",
    "openai",
    "huggingface"
  ],
  "dependencies": {
    "concurrently": "^8.2.0"
  }
}
```

## Summary

In this section, we've set up the backend project structure and created all the necessary components for our GraphQL server. We've implemented:

1. The Express server with Apollo Server integration
2. GraphQL schema with types, queries, and mutations
3. A native system module for data population
4. A data API with fallback mechanisms
5. GraphQL resolvers to handle queries and mutations

In the next section, we'll focus on the GraphQL integration details and how the frontend and backend communicate.
