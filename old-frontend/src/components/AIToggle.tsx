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
  // We can use the context directly or use the props passed from parent
  const { isOpenAI, isHuggingFace } = useAIProvider();
  
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


// import React from 'react';
// import styled from 'styled-components';
// import { useAIProvider } from '../context/AIProviderContext';
// import { AIProvider } from '../services/aiService';

// interface AIToggleProps {
//   activeProvider: AIProvider;
//   onToggle: (provider: AIProvider) => void;
// }
//  export default AIToggle;
// // ... rest of the file ...
