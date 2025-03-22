import React from 'react';
import styled from 'styled-components';

interface QueryFormProps {
  onSubmit: (query: string) => void;
}

const FormContainer = styled.div`
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Arial', sans-serif;
  font-size: 1rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #4285f4;
    box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.3);
  }
`;

const SubmitButton = styled.button`
  align-self: flex-end;
  padding: 0.75rem 1.5rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #3367d6;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.3);
  }
`;

const QueryForm: React.FC<QueryFormProps> = ({ onSubmit }) => {
  const [queryText, setQueryText] = React.useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryText.trim()) {
      onSubmit(queryText.trim());
    }
  };
  
  return (
    <FormContainer>
      <h2>Enter Your Query</h2>
      <Form onSubmit={handleSubmit}>
        <TextArea
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          placeholder="Enter your query here..."
          aria-label="Query input"
        />
        <SubmitButton type="submit">Submit Query</SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default QueryForm;
