import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AIToggle from '../AIToggle';
import { AIProviderProvider } from '../../context/AIProviderContext';

describe('AIToggle', () => {
  test('calls onToggle with openai and huggingface when buttons clicked', async () => {
    const user = userEvent.setup();
    const handleToggle = jest.fn();

    render(
      <AIProviderProvider>
        <AIToggle activeProvider="openai" onToggle={handleToggle} />
      </AIProviderProvider>
    );

    const openAIButton = screen.getByRole('button', { name: /openai/i });
    const hfButton = screen.getByRole('button', { name: /huggingface/i });

    await user.click(hfButton);
    expect(handleToggle).toHaveBeenCalledWith('huggingface');

    await user.click(openAIButton);
    expect(handleToggle).toHaveBeenCalledWith('openai');
  });
});
