<!--
Author: Sach-AI llc California
Email: Sach.ai@outlook.com
-->

# AI Integration with OpenAI and HuggingFace

This section of the tutorial covers integrating both OpenAI and HuggingFace AI services into our application, and implementing a service factory pattern to switch between them.

## Understanding AI Integration in Our Application

Our application integrates with two popular AI services:

1. **OpenAI**: Known for powerful models like GPT-4
2. **HuggingFace**: Offers a wide range of open-source models

We've implemented a service factory pattern that allows us to:
- Abstract away the specific implementation details of each AI service
- Easily switch between providers using a toggle in the UI
- Add new AI providers in the future with minimal changes

## Setting Up the AI Service Factory

Let's start by creating the AI service factory that will manage our AI providers:

### Step 1: Create the AI Service Factory

Create `src/services/aiServiceFactory.js`:

```javascript
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
```

This factory:
- Maintains a registry of available AI services
- Provides a method to get a specific service by name
- Offers a common interface for processing queries with any provider
- Handles errors consistently across providers

## Implementing the OpenAI Service

Now let's implement the OpenAI service:

### Step 1: Create the OpenAI Service

Create `src/services/openaiService.js`:

```javascript
// OpenAI API integration service
const { OpenAI } = require('openai');

class OpenAIService {
  constructor() {
    // Initialize OpenAI client
    // In a production environment, you would use an actual API key
    // this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // For demo purposes, we'll simulate the API responses
    this.isSimulated = true;
  }

  // Method to process a query using OpenAI
  async processQuery(query) {
    try {
      if (this.isSimulated) {
        return this.simulateResponse(query);
      }
      
      // This would be the actual OpenAI API call in production
      /*
      const response = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful assistant providing concise information." },
          { role: "user", content: query }
        ],
        max_tokens: 500
      });
      
      return {
        content: response.choices[0].message.content,
        model: response.model,
        usage: response.usage
      };
      */
    } catch (error) {
      console.error('Error processing query with OpenAI:', error);
      throw new Error(`OpenAI processing failed: ${error.message}`);
    }
  }

  // Method to simulate OpenAI responses for demo purposes
  simulateResponse(query) {
    console.log(`Simulating OpenAI response for query: ${query}`);
    
    // Simulate processing delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = {
          id: `openai-${Date.now()}`,
          title: `OpenAI Analysis: ${query}`,
          content: this.generateSimulatedContent(query),
          source: 'OpenAI GPT-4',
          model: 'gpt-4-simulated',
          timestamp: new Date().toISOString()
        };
        
        resolve(response);
      }, 1000);
    });
  }

  // Helper to generate simulated content
  generateSimulatedContent(query) {
    const topics = {
      'technology': 'The latest advancements in technology show significant progress in artificial intelligence and quantum computing. Researchers have developed new algorithms that improve efficiency by 30% while reducing computational requirements.',
      'science': 'Recent scientific studies have revealed fascinating insights into cellular regeneration. The findings suggest potential applications in treating degenerative diseases and extending human lifespan.',
      'business': 'Market analysis indicates a shift towards sustainable business practices. Companies adopting green technologies are seeing 25% higher customer retention rates and improved brand loyalty.',
      'health': 'New research in health sciences points to the importance of microbiome diversity for overall wellbeing. A balanced diet rich in diverse plant foods can significantly improve gut health and immune function.',
      'politics': 'Political analysts observe increasing polarization in democratic systems worldwide. Bridging divides requires improved communication channels and focus on shared values rather than differences.',
      'education': 'Educational paradigms are evolving with technology integration. Personalized learning approaches show 40% better outcomes in student engagement and knowledge retention compared to traditional methods.'
    };
    
    // Find relevant topic or use general response
    const matchedTopic = Object.keys(topics).find(topic => 
      query.toLowerCase().includes(topic.toLowerCase())
    );
    
    const baseContent = matchedTopic ? topics[matchedTopic] : 
      'Based on the available information, this query requires a nuanced understanding of multiple factors. Consider exploring specific aspects to get more detailed insights.';
    
    return `${baseContent}\n\nThis analysis is based on processing your query "${query}" through advanced language models. For more specific information, please refine your question with additional details.`;
  }
}

module.exports = OpenAIService;
```

This service:
- Provides a method to process queries using OpenAI
- Includes a simulation mode for demo purposes
- Generates realistic-looking responses based on the query topic
- Handles errors and provides meaningful error messages

## Implementing the HuggingFace Service

Now let's implement the HuggingFace service:

### Step 1: Create the HuggingFace Service

Create `src/services/huggingfaceService.js`:

```javascript
// HuggingFace API integration service
const { HfInference } = require('@huggingface/inference');

class HuggingFaceService {
  constructor() {
    // Initialize HuggingFace client
    // In a production environment, you would use an actual API key
    // this.client = new HfInference(process.env.HUGGINGFACE_API_KEY);
    
    // For demo purposes, we'll simulate the API responses
    this.isSimulated = true;
  }

  // Method to process a query using HuggingFace
  async processQuery(query) {
    try {
      if (this.isSimulated) {
        return this.simulateResponse(query);
      }
      
      // This would be the actual HuggingFace API call in production
      /*
      const response = await this.client.textGeneration({
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        inputs: `<s>[INST] ${query} [/INST]`,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7
        }
      });
      
      return {
        content: response.generated_text,
        model: "mistralai/Mistral-7B-Instruct-v0.2",
      };
      */
    } catch (error) {
      console.error('Error processing query with HuggingFace:', error);
      throw new Error(`HuggingFace processing failed: ${error.message}`);
    }
  }

  // Method to simulate HuggingFace responses for demo purposes
  simulateResponse(query) {
    console.log(`Simulating HuggingFace response for query: ${query}`);
    
    // Simulate processing delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = {
          id: `huggingface-${Date.now()}`,
          title: `HuggingFace Analysis: ${query}`,
          content: this.generateSimulatedContent(query),
          source: 'HuggingFace Mistral-7B',
          model: 'mistralai/Mistral-7B-Instruct-v0.2-simulated',
          timestamp: new Date().toISOString()
        };
        
        resolve(response);
      }, 1000);
    });
  }

  // Helper to generate simulated content
  generateSimulatedContent(query) {
    const topics = {
      'technology': 'Technological advancements continue to reshape our world at an unprecedented pace. Recent developments in neural networks have enabled more efficient processing with lower computational requirements, making AI more accessible to smaller organizations.',
      'science': 'Scientific research has made remarkable strides in understanding cellular mechanisms. New findings suggest potential applications in regenerative medicine that could revolutionize treatment approaches for previously incurable conditions.',
      'business': 'Business trends indicate a growing emphasis on sustainable practices and ethical considerations. Companies implementing environmentally conscious policies are experiencing improved customer loyalty and stronger market positioning.',
      'health': 'Health research emphasizes the critical role of preventative care and lifestyle factors. Studies show that regular physical activity combined with a balanced diet can significantly reduce the risk of chronic diseases.',
      'politics': 'Political landscapes are experiencing increased fragmentation across democratic systems. Building consensus requires focusing on shared values and establishing common ground despite ideological differences.',
      'education': 'Educational methodologies are evolving to incorporate more personalized approaches. Adaptive learning systems that respond to individual student needs show promising results in improving learning outcomes across diverse student populations.'
    };
    
    // Find relevant topic or use general response
    const matchedTopic = Object.keys(topics).find(topic => 
      query.toLowerCase().includes(topic.toLowerCase())
    );
    
    const baseContent = matchedTopic ? topics[matchedTopic] : 
      'The query requires consideration of multiple factors and perspectives. A more specific question would help provide more targeted information on this topic.';
    
    return `${baseContent}\n\nThis response was generated based on your query: "${query}". For more detailed information, consider specifying particular aspects of interest.`;
  }
}

module.exports = HuggingFaceService;
```

This service:
- Provides a method to process queries using HuggingFace
- Includes a simulation mode for demo purposes
- Generates realistic-looking responses based on the query topic
- Handles errors and provides meaningful error messages

## Integrating AI Services with GraphQL Resolvers

Now we need to update our GraphQL resolvers to use the AI service factory:

### Step 1: Import the AI Service Factory

Add this import to the top of `src/resolvers/resolvers.js`:

```javascript
const aiServiceFactory = require('../services/aiServiceFactory');
```

### Step 2: Update the getData Resolver

Update the getData resolver to use the AI service factory when no data is found:

```javascript
// If no data exists, process the query with the specified AI provider
console.log(`No data found for query: ${query}. Processing with ${provider}...`);
const aiResponse = await aiServiceFactory.processQuery(query, provider);

// Convert AI response to DataItem format if needed
const aiData = Array.isArray(aiResponse) ? aiResponse : [aiResponse];

// Add to dataStore
dataStore = [...dataStore, ...aiData];

return aiData;
```

### Step 3: Update the populateData Resolver

Update the populateData resolver to use the AI service factory when no data is found:

```javascript
// If no data from native system, use AI provider
if (!data || data.length === 0) {
  console.log(`No data from native system for query: ${query}. Using ${provider}...`);
  const aiResponse = await aiServiceFactory.processQuery(query, provider);
  
  // Convert AI response to DataItem format if needed
  data = Array.isArray(aiResponse) ? aiResponse : [aiResponse];
  
  // Add to dataStore
  dataStore = [...dataStore, ...data];
}
```

## Setting Up Environment Variables for API Keys

In a production environment, you would need to set up environment variables for your API keys:

### Step 1: Create a .env File

Create a `.env` file in the backend directory:

```
OPENAI_API_KEY=your_openai_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

### Step 2: Load Environment Variables

Install the dotenv package:

```bash
npm install dotenv
```

Add this to the top of your `server.js` file:

```javascript
require('dotenv').config();
```

### Step 3: Use Environment Variables in Services

Update the OpenAI service constructor:

```javascript
constructor() {
  // Initialize OpenAI client with API key from environment variables
  this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  // Use simulation mode if no API key is provided
  this.isSimulated = !process.env.OPENAI_API_KEY;
}
```

Update the HuggingFace service constructor:

```javascript
constructor() {
  // Initialize HuggingFace client with API key from environment variables
  this.client = new HfInference(process.env.HUGGINGFACE_API_KEY);
  
  // Use simulation mode if no API key is provided
  this.isSimulated = !process.env.HUGGINGFACE_API_KEY;
}
```

## Testing AI Integration

You can test the AI integration by sending queries through the GraphQL API:

### Testing OpenAI Integration:

```graphql
query {
  getData(query: "latest technology trends", provider: "openai") {
    id
    title
    content
    source
  }
}
```

### Testing HuggingFace Integration:

```graphql
query {
  getData(query: "climate change solutions", provider: "huggingface") {
    id
    title
    content
    source
  }
}
```

## Adding New AI Providers

One of the benefits of our service factory pattern is that it's easy to add new AI providers:

1. Create a new service class (e.g., `anthropicService.js`)
2. Implement the same interface with a `processQuery` method
3. Add the new service to the factory:

```javascript
constructor() {
  this.services = {
    openai: new OpenAIService(),
    huggingface: new HuggingFaceService(),
    anthropic: new AnthropicService()
  };
}
```

4. Update the frontend toggle component to include the new provider

## Summary

In this section, we've implemented AI integration with both OpenAI and HuggingFace:

1. We've created a service factory pattern to manage different AI providers
2. We've implemented services for OpenAI and HuggingFace
3. We've integrated these services with our GraphQL resolvers
4. We've set up environment variables for API keys
5. We've tested the AI integration through GraphQL queries
6. We've discussed how to add new AI providers in the future

In the next section, we'll focus on the toggle functionality that allows users to switch between AI providers.
