
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Pattern Editor', () => {
  it('renders the pattern input and chart preview', () => {
    render(<App />);

    expect(
      screen.getByLabelText('Pattern Instructions')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Chart Preview')
    ).toBeInTheDocument();
  });

  it('disables Generate Chart when input is empty', () => {
    render(<App />);

    expect(
      screen.getByRole('button', { name: 'Generate Chart' })
    ).toBeDisabled();
  });

  it('enables Generate Chart when instructions are entered', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(
      screen.getByLabelText('Pattern Instructions'),
      'Row 1: k1, sl1, k1'
    );

    expect(
      screen.getByRole('button', { name: 'Generate Chart' })
    ).toBeEnabled();
  });

  it('sends entered instructions to the API', async () => {
    const user = userEvent.setup();

    const mockFetch = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          parsed_array: ['#', ' ', '#', 1],
        }),
      });

    try {
      render(<App />);

      await user.type(
        screen.getByLabelText('Pattern Instructions'),
        'Row 1: k1, sl1, k1'
      );

      await user.click(
        screen.getByRole('button', { name: 'Generate Chart' })
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/pattern',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            instructions: 'Row 1: k1, sl1, k1',
          }),
        })
      );
    } finally {
      mockFetch.mockRestore();
    }
  });
});
