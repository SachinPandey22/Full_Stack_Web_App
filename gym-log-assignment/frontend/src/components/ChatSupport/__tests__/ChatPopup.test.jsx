import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ChatPopup from '../ChatPopup';
import { useAuth } from '../../../context/AuthContext';

jest.mock('../../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../SearchSupport', () => () => <div data-testid="search-support" />);

describe('ChatPopup handleSendMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    global.fetch = jest.fn();
    useAuth.mockReturnValue({
      user: null,
      profile: { name: 'Taylor Swift' },
    });
  });

  it('sends support message when both fields are filled', async () => {
    const email = 'coach@example.com';
    const message = 'Need a hand with workouts';
    global.fetch.mockResolvedValue({ ok: true });

    render(
      <MemoryRouter>
        <ChatPopup />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /💬/i }));
    fireEvent.click(screen.getByText(/send us a message/i));

    fireEvent.change(screen.getByPlaceholderText(/email@example.com/i), {
      target: { value: email },
    });
    fireEvent.change(screen.getByPlaceholderText(/message\.\.\./i), {
      target: { value: message },
    });

    fireEvent.click(screen.getByRole('button', { name: '➤' }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/api/support/contact/',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      }),
    );
    expect(window.alert).toHaveBeenCalledWith("✅ Message sent! We'll get back to you soon.");
  });
});
