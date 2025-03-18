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
