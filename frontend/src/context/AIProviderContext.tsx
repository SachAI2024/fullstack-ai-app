import React, { useState, createContext, useContext, ReactNode } from 'react';

// Define the type for our AI provider
export type AIProvider = 'openai' | 'huggingface';

// Define the type for our context value
type AIProviderContextType = {
  provider: AIProvider;
  toggleProvider: (newProvider?: AIProvider) => void;
  isOpenAI: boolean;
  isHuggingFace: boolean;
};

// Create context for AI provider with proper types
const AIProviderContext = createContext<AIProviderContextType>({
  provider: 'openai',
  toggleProvider: () => {},
  isOpenAI: true,
  isHuggingFace: false
});

// Define props type for the provider component
interface AIProviderProviderProps {
  children: ReactNode;
}

// Provider component with proper type annotations
export const AIProviderProvider: React.FC<AIProviderProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<AIProvider>('openai');

  const toggleProvider = (newProvider?: AIProvider): void => {
    if (newProvider && (newProvider === 'openai' || newProvider === 'huggingface')) {
      setProvider(newProvider);
    } else {
      // Toggle between the two providers
      setProvider(prev => prev === 'openai' ? 'huggingface' : 'openai');
    }
  };

  const value: AIProviderContextType = {
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
export const useAIProvider = (): AIProviderContextType => {
  const context = useContext(AIProviderContext);
  if (context === undefined) {
    throw new Error('useAIProvider must be used within an AIProviderProvider');
  }
  return context;
};
