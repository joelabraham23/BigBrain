import { render, fireEvent, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import GameDialog from './GameDialog';
import { CopyToClipboardButton } from './GameDialog';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('GameDialog', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders sessionId when game is active', () => {
    const onClose = jest.fn();
    render(<GameDialog onClose={onClose} open={true} sessionId="1234" gameActive={true} quizId="5678" />);

    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.queryByText('Would you like to view the results?')).not.toBeInTheDocument();
  });

  test('renders "Would you like to view the results?" when game is not active', () => {
    const onClose = jest.fn();
    render(<GameDialog onClose={onClose} open={true} sessionId="1234" gameActive={false} quizId="5678" recentSessionId="5678" />);

    expect(screen.getByText('Would you like to view the results?')).toBeInTheDocument();
    expect(screen.queryByText('1234')).not.toBeInTheDocument();
  });

  test('calls onClose when No button is clicked', () => {
    const onClose = jest.fn();
    render(<GameDialog onClose={onClose} open={true} sessionId="1234" gameActive={false} quizId="5678" recentSessionId="5678" />);
    fireEvent.click(screen.getByText('No'));

    expect(onClose).toHaveBeenCalled();
  });

  test('navigates to recent session when Yes button is clicked', () => {
    const onClose = jest.fn();
    render(<GameDialog onClose={onClose} open={true} sessionId="1234" gameActive={false} quizId="5678" recentSessionId="5678" />);
    fireEvent.click(screen.getByText('Yes'));

    expect(onClose).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/quiz/5678/5678');
  });

  test('navigates to game screen when Game Screen button is clicked', () => {
    const onClose = jest.fn();
    render(<GameDialog onClose={onClose} open={true} sessionId="1234" gameActive={true} quizId="5678" />);
    fireEvent.click(screen.getByText('Game Screen'));

    expect(mockNavigate).toHaveBeenCalledWith('/quiz/5678/1234');
  });

  test('calls stopGame function when Stop Game button is clicked', () => {
    const onClose = jest.fn();
    const stopGame = jest.fn();
    render(<GameDialog onClose={onClose} open={true} sessionId="1234" gameActive={true} quizId="5678" stopGame={stopGame} />);
    fireEvent.click(screen.getByText('Stop Game'));

    expect(stopGame).toHaveBeenCalled();
  });
});

describe('CopyToClipboardButton', () => {
  test('renders "Copy Link" button', () => {
    const sessionId = '1234';
    render(<CopyToClipboardButton sessionId={sessionId} />);

    expect(screen.getByText('Copy Link')).toBeInTheDocument();
  });

  test('renders "Copied!" button after click', () => {
    const sessionId = '1234';
    render(<CopyToClipboardButton sessionId={sessionId} />);
    fireEvent.click(screen.getByText('Copy Link'));

    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });
});
