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
