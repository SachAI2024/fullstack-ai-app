# Full Stack Application with React, GraphQL, OpenAI and HuggingFace

This is a single page application that uses React for the frontend and GraphQL for the backend. The application connects to both OpenAI and HuggingFace APIs and allows users to toggle between them.

## Features

- React frontend with Apollo Client for GraphQL integration
- GraphQL server with Apollo Server and Express
- Data fetching mechanism with fallback to native system modules
- Integration with OpenAI API
- Integration with HuggingFace API
- Toggle functionality to switch between AI providers

  [For more info visit the Wiki page ](https://github.com/SachAI2024/fullstack-ai-app/wiki)

## Project Structure

```
fullstack-app/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── context/          # React context providers
│   │   ├── services/         # Service files for API interactions
│   │   ├── App.tsx           # Main App component
│   │   └── index.tsx         # Entry point
│   └── package.json          # Frontend dependencies
├── backend/                  # GraphQL server
│   ├── src/
│   │   ├── datasources/      # Data sources for GraphQL
│   │   ├── resolvers/        # GraphQL resolvers
│   │   ├── schema/           # GraphQL schema
│   │   ├── services/         # Service files for AI providers
│   │   └── server.js         # Server entry point
│   └── package.json          # Backend dependencies
└── package.json              # Root package.json with scripts
```

## Installation

1. Clone the repository
2. Install dependencies:

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

## Running the Application

You can run both the frontend and backend concurrently with:

```bash
npm start
```

Or run them separately:

```bash
# Run backend only
npm run start:backend

# Run frontend only
npm run start:frontend
```

## How It Works

1. The frontend sends GraphQL queries to the backend with a specified AI provider (OpenAI or HuggingFace)
2. The GraphQL server first checks if data exists for the query
3. If data exists, it returns it directly
4. If no data exists, it triggers the native system modules to populate the data
5. If the native system modules can't provide data, it uses the specified AI provider
6. The frontend displays the results and allows toggling between AI providers

[For more info visit the Wiki page ](https://github.com/SachAI2024/fullstack-ai-app/wiki)

## API Integration

### OpenAI Integration

The application integrates with OpenAI's API through the `OpenAIService` class. In a production environment, you would need to provide an API key through environment variables.

### HuggingFace Integration

The application integrates with HuggingFace's API through the `HuggingFaceService` class. In a production environment, you would need to provide an API key through environment variables.

## Toggle Functionality

The application uses React Context to manage the AI provider state across components. The `AIProviderContext` provides the current provider and a function to toggle between providers.

## Data Fetching Mechanism

The application implements a multi-level data fetching mechanism:

1. Check if data exists in the GraphQL cache
2. Check if data exists in the native system module
3. If no data exists, trigger the native system module to populate data
4. If the native system can't provide data, use the specified AI provider

[For more info visit the Wiki page ](https://github.com/SachAI2024/fullstack-ai-app/wiki)

This ensures efficient data retrieval and fallback mechanisms when data isn't available.

## Production Deployment

For production deployment, you would need to:

1. Set up proper environment variables for API keys
2. Configure proper error handling and logging
3. Set up a production database instead of the in-memory data store
4. Implement authentication and authorization if needed
5. Configure CORS properly for your production domains

[For more info visit the Wiki page ](https://github.com/SachAI2024/fullstack-ai-app/wiki)
