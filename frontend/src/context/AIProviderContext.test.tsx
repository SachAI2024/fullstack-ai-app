import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AIProviderProvider, useAIProvider } from './AIProviderContext';

const wrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <AIProviderProvider>{children}</AIProviderProvider>
);

test('useAIProvider defaults to openai', () => {
  const { result } = renderHook(() => useAIProvider(), { wrapper });
  expect(result.current.provider).toBe('openai');
  expect(result.current.isOpenAI).toBe(true);
  expect(result.current.isHuggingFace).toBe(false);
});

test('toggleProvider toggles between providers when no argument', () => {
  const { result } = renderHook(() => useAIProvider(), { wrapper });
  act(() => result.current.toggleProvider());
  expect(result.current.provider).toBe('huggingface');
  act(() => result.current.toggleProvider());
  expect(result.current.provider).toBe('openai');
});

test('toggleProvider sets provider when argument supplied', () => {
  const { result } = renderHook(() => useAIProvider(), { wrapper });
  act(() => result.current.toggleProvider('huggingface'));
  expect(result.current.provider).toBe('huggingface');
  act(() => result.current.toggleProvider('openai'));
  expect(result.current.provider).toBe('openai');
});

test('useAIProvider throws error outside provider', () => {
  expect(() => renderHook(() => useAIProvider())).toThrow(
    'useAIProvider must be used within an AIProviderProvider'
  );
});
