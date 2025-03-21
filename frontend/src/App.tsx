import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/client';
import AIToggle from './components/AIToggle';
import DataDisplay from './components/DataDisplay';
import QueryForm from './components/QueryForm';
import { useAIProvider } from './context/AIProviderContext';
import { GET_DATA, POPULATE_DATA, AIProvider } from './services/aiService';
import './App.css';

// ... rest of the file ...

// Handle AI provider toggle
const handleToggleChange = (newProvider: AIProvider) => {
  toggleProvider(newProvider);
  
  // Refetch data with new provider if there's an active query
  if (query) {
    refetch({ query, provider: newProvider });
  }
};

// ... rest of the file ...
