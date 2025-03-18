// AI Service Factory to handle different AI providers
const OpenAIService = require('./openaiService');
const HuggingFaceService = require('./huggingfaceService');

class AIServiceFactory {
  constructor() {
    this.services = {
      openai: new OpenAIService(),
      huggingface: new HuggingFaceService()
    };
  }

  // Get the appropriate service based on provider
  getService(provider) {
    if (!this.services[provider]) {
      throw new Error(`AI provider '${provider}' is not supported`);
    }
    return this.services[provider];
  }

  // Process a query using the specified AI provider
  async processQuery(query, provider = 'openai') {
    try {
      const service = this.getService(provider);
      return await service.processQuery(query);
    } catch (error) {
      console.error(`Error processing query with ${provider}:`, error);
      throw new Error(`AI processing failed: ${error.message}`);
    }
  }
}

module.exports = new AIServiceFactory();
