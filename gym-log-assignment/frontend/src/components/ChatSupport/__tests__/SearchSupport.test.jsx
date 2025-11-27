import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchSupport from '../SearchSupport';
import { useAuth } from '../../../context/AuthContext';
import { sendChatMessage } from '../../../services/api';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock('../../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../services/api', () => ({
  sendChatMessage: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock('../../../utils/dateUtils', () => ({
  getDaysSince: jest.fn(() => 10),
}));

describe('SearchSupport handleSend', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    useAuth.mockReturnValue({
      getAccessToken: jest.fn(() => null),
      user: null,
      profile: null,
      refreshProfile: jest.fn().mockResolvedValue({}),
      isProfileLoading: false,
      profileUpdatedAt: null,
    });
  });

  it('appends login reminder when token is missing', async () => {
    render(<SearchSupport />);

    fireEvent.change(screen.getByPlaceholderText(/type your message/i), {
      target: { value: 'Need workout tips' },
    });

    fireEvent.click(screen.getByRole('button', { name: '➤' }));

    await waitFor(() =>
      expect(
        screen.getByText(/please log in so i can tailor recommendations to your profile/i),
      ).toBeInTheDocument(),
    );

    expect(sendChatMessage).not.toHaveBeenCalled();
  });
});
