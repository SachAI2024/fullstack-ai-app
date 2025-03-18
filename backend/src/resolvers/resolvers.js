// Updated resolvers with AI service integration
const aiServiceFactory = require('../services/aiServiceFactory');

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
