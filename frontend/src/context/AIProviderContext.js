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
