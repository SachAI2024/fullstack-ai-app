<!--
Author: Sach-AI llc California
Email: Sach.ai@outlook.com
-->

# Toggle Functionality and GitHub Sharing Instructions

This section of the tutorial covers implementing the toggle functionality between AI providers and provides instructions for sharing this tutorial on GitHub.

## Part 1: Implementing the Toggle Functionality

The toggle functionality allows users to switch between OpenAI and HuggingFace AI providers with a simple UI control. Let's explore how this is implemented.

### Understanding the Toggle Architecture

Our toggle functionality is implemented using:

1. **React Context**: To manage the AI provider state across components
2. **GraphQL Parameters**: To pass the selected provider to the backend
3. **UI Components**: To provide a visual toggle interface

### React Context for Provider State

We use React Context to manage the AI provider state across the application:

```jsx
// src/context/AIProviderContext.js
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

### Toggle UI Component

We implement a toggle UI component to switch between providers:

```jsx
// src/components/AIToggle.tsx
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

### Integrating the Toggle with GraphQL

In our App component, we integrate the toggle with GraphQL queries:

```jsx
// src/App.tsx (relevant parts)
function App() {
  const [query, setQuery] = useState('');
  const { provider, toggleProvider } = useAIProvider();
  
  // Query for data with provider parameter
  const { loading, error, data, refetch } = useQuery(GET_DATA, {
    variables: { query, provider },
    skip: !query, // Skip the query if no query string is provided
  });

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
      {/* Rest of the component */}
    </AppContainer>
  );
}
```

### Styling the Toggle Based on Provider

We can style components differently based on the selected provider:

```jsx
// src/components/DataDisplay.tsx (relevant parts)
const CardHeader = styled.div<{ provider: string }>`
  padding: 1rem;
  background-color: ${props => props.provider === 'openai' ? '#10a37f' : '#ffbd59'};
  color: white;
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
```

## Part 2: GitHub Sharing Instructions

Now let's go through the steps to share this tutorial on GitHub.

### Step 1: Create a GitHub Account

If you don't already have a GitHub account:

1. Go to [GitHub](https://github.com/)
2. Click "Sign up" and follow the registration process
3. Verify your email address

### Step 2: Create a New Repository

1. Log in to your GitHub account
2. Click the "+" icon in the top-right corner and select "New repository"
3. Enter a repository name (e.g., "react-graphql-ai-tutorial")
4. Add a description (e.g., "A tutorial for building a full stack application with React, GraphQL, and AI integration")
5. Choose "Public" visibility
6. Check "Add a README file"
7. Click "Create repository"

### Step 3: Clone the Repository Locally

1. On your repository page, click the green "Code" button
2. Copy the HTTPS URL
3. Open a terminal on your local machine
4. Run the following command:

```bash
git clone https://github.com/yourusername/react-graphql-ai-tutorial.git
cd react-graphql-ai-tutorial
```

### Step 4: Prepare the Tutorial Files

1. Copy all the tutorial files from the `/home/ubuntu/fullstack-app/tutorial` directory to your local repository folder
2. Organize the files in a logical structure:

```
react-graphql-ai-tutorial/
├── README.md                      # Main README with tutorial overview
├── 01-project-overview.md         # Project overview
├── 02-frontend-setup.md           # Frontend setup tutorial
├── 03-backend-setup.md            # Backend setup tutorial
├── 04-graphql-integration.md      # GraphQL integration tutorial
├── 05-ai-integration.md           # AI integration tutorial
├── 06-toggle-and-github.md        # Toggle functionality and GitHub instructions
└── code/                          # Optional: Include code samples
    ├── frontend/                  # Frontend code samples
    └── backend/                   # Backend code samples
```

### Step 5: Update the Main README.md

Create or update the main README.md file with an overview of the tutorial:

```markdown
# Full Stack Application with React, GraphQL, and AI Integration

A comprehensive tutorial for building a single page application that uses React and GraphQL to connect the presentation layer via a northbound API. The application integrates with both OpenAI and HuggingFace, with a toggle button to switch between them.

## Tutorial Sections

1. [Project Overview](01-project-overview.md)
2. [Frontend Setup](02-frontend-setup.md)
3. [Backend Setup](03-backend-setup.md)
4. [GraphQL Integration](04-graphql-integration.md)
5. [AI Integration](05-ai-integration.md)
6. [Toggle Functionality and GitHub Instructions](06-toggle-and-github.md)

## Features

- React frontend with Apollo Client for GraphQL integration
- GraphQL server with Apollo Server and Express
- Data fetching mechanism with fallback to native modules
- Integration with OpenAI and HuggingFace APIs
- Toggle functionality to switch between AI providers

## Author

Sach-AI llc California  
Email: Sach.ai@outlook.com

## License

This project is licensed under the MIT License - see the LICENSE file for details.
```

### Step 6: Commit and Push to GitHub

1. Add all files to git:

```bash
git add .
```

2. Commit the changes:

```bash
git commit -m "Add full stack application tutorial with React, GraphQL, and AI integration"
```

3. Push to GitHub:

```bash
git push origin main
```

### Step 7: Enhance the Repository (Optional)

Consider adding these enhancements to make your repository more professional:

1. **Add a License**: Go to your repository on GitHub, click "Add file" > "Create new file", name it "LICENSE", and GitHub will offer license templates.

2. **Add a .gitignore file**: Create a .gitignore file to exclude unnecessary files:

```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

3. **Add GitHub Actions**: Create a simple workflow to check for markdown formatting issues:

Create a file at `.github/workflows/markdown-check.yml`:

```yaml
name: Markdown Check

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  markdown-check:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Markdown Lint
      uses: avto-dev/markdown-lint@v1
      with:
        config: '.markdownlint.json'
        args: '*.md'
```

### Step 8: Share Your Repository

1. **Share the URL**: Share the URL of your GitHub repository with others
2. **Create a GitHub Pages site**: Go to repository settings > Pages and set up GitHub Pages to create a website from your tutorial
3. **Share on social media**: Share your tutorial on Twitter, LinkedIn, or other platforms
4. **Submit to developer communities**: Share on communities like Dev.to, Hashnode, or Reddit's programming subreddits

## Summary

In this section, we've covered:

1. **Toggle Functionality**: How to implement a toggle between AI providers using React Context and styled components
2. **GitHub Sharing**: Step-by-step instructions for sharing this tutorial on GitHub

This completes our tutorial on building a full stack application with React, GraphQL, and AI integration. You now have the knowledge to build similar applications and share your work with the developer community.

Happy coding!
