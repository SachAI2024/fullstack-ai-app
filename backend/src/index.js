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
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// Start the server
startServer().catch(error => {
  console.error('Error starting server:', error);
});
