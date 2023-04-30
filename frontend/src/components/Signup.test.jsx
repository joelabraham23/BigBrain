import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import SignUp from './SignUp';
import { apiCall, RedirectToDash } from '../helpers';
import { useNavigate } from 'react-router';

jest.mock('../helpers');
jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
}));

describe('SignUp', () => {
  it('renders without crashing', () => {
    render(<SignUp />);
  });

  it('calls apiCall and sets token when the "Sign Up" button is clicked', async () => {
    const apiCallMock = jest.spyOn(apiCall, 'mockImplementation');
    apiCallMock.mockResolvedValueOnce({ token: 'mockToken' });
    const setItemMock = jest.fn();
    const localStorageMock = {
      setItem: setItemMock,
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });

    render(<SignUp />);
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'mockName' },
    });
    fireEvent.change(screen.getByLabelText('email'), {
      target: { value: 'mockEmail' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'mockPassword' },
    });
    fireEvent.click(screen.getByText('Sign Up'));

    expect(apiCallMock).toHaveBeenCalledWith(
      'admin/auth/register',
      'POST',
      JSON.stringify({
        email: 'mockEmail',
        password: 'mockPassword',
        name: 'mockName',
      })
    );
    expect(setItemMock).toHaveBeenCalledWith('token', 'mockToken');
    expect(useNavigate).toHaveBeenCalledWith('/Dashboard');
  });

  it('redirects to dashboard if user is already logged in', () => {
    RedirectToDash.mockImplementationOnce(() => {
      useNavigate.mockImplementationOnce(() => ({ navigate: jest.fn() }));
      return true;
    });
    render(<SignUp />);

    expect(useNavigate).toHaveBeenCalledWith('/');
  });
});