// import React, { useState } from 'react';
// import styled from 'styled-components';
// import { useQuery, useMutation } from '@apollo/client';
// import AIToggle from './components/AIToggle';
// import DataDisplay from './components/DataDisplay';
// import QueryForm from './components/QueryForm';
// import { useAIProvider } from './context/AIProviderContext';
// import { GET_DATA, POPULATE_DATA, AIProvider } from './services/aiService';
// import './App.css';

// // ... rest of the file ...

// // // Handle AI provider toggle
// // const handleToggleChange = (newProvider: AIProvider) => {
// //   toggleProvider(newProvider);
  
// //   // Refetch data with new provider if there's an active query
// //   if (query) {
// //     refetch({ query, provider: newProvider });
// //   }
// // };

// // // ... rest of the file ...


// // Example query variable
// const query = "your-query-here";

// // Handle AI provider toggle
// const handleToggleChange = (newProvider: AIProvider) => {
//   toggleProvider(newProvider);
  
//   // Refetch data with new provider if there's an active query
//   if (query) {
//     refetch({ query, provider: newProvider });
//   }
// };

import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/client';
import AIToggle from './components/AIToggle';
import DataDisplay from './components/DataDisplay';
import QueryForm from './components/QueryForm';
import { useAIProvider } from './context/AIProviderContext';
import { GET_DATA, POPULATE_DATA, AIProvider } from './services/aiService';
import './App.css';

// Example query variable
const query = "your-query-here";

// Handle AI provider toggle
const handleToggleChange = (newProvider: AIProvider) => {
  toggleProvider(newProvider);
  
  // Refetch data with new provider if there's an active query
  if (query) {
    refetch({ query, provider: newProvider });
  }
};

// Your main App component
const App = () => {
  return (
    <div>
      {/* Your component code here */}
    </div>
  );
};

export default App;
