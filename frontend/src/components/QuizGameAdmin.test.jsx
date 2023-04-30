import { render, screen, waitFor } from '@testing-library/react';
import QuizGameAdmin from './QuizGameAdmin';

jest.mock('react-router-dom', () => ({
  useParams: () => ({
    quizId: '1',
    sessionId: '2'
  }),
}));

jest.mock('../helpers', () => ({
  RedirectToAuth: jest.fn(),
  apiCall: jest.fn()
}));

describe('QuizGameAdmin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading message when gameActive is null', () => {
    render(<QuizGameAdmin />);
    expect(screen.getByText('Loading page..')).toBeInTheDocument();
  });

  test('redirects to authentication page with correct path', () => {
    render(<QuizGameAdmin />);
    expect(require('../helpers').RedirectToAuth).toHaveBeenCalledWith('quiz/1/2');
  });

  test('renders QuizActive component when gameActive is true', async () => {
    require('../helpers').apiCall.mockResolvedValueOnce({
      results: {
        active: true
      }
    });

    render(<QuizGameAdmin />);
    await waitFor(() => expect(screen.getByText('QuizActive')).toBeInTheDocument());
  });

  test('renders QuizResults component when gameActive is false', async () => {
    require('../helpers').apiCall.mockResolvedValueOnce({
      results: {
        active: false
      }
    });

    render(<QuizGameAdmin />);
    await waitFor(() => expect(screen.getByText('QuizResults')).toBeInTheDocument());
  });

  test('calls handleNextQuestion function when button is clicked', async () => {
    require('../helpers').apiCall.mockResolvedValueOnce({
      results: {
        active: true
      }
    });

    const handleNextQuestion = jest.fn();
    render(<QuizGameAdmin handleNextQuestion={handleNextQuestion} />);
    const button = screen.getByText('Next Question');
    button.click();

    await waitFor(() => expect(handleNextQuestion).toHaveBeenCalled());
    expect(require('../helpers').apiCall).toHaveBeenCalledWith('admin/quiz/1/advance', 'POST', JSON.stringify({}));
  });

  test('calls handleStopGame function when button is clicked', async () => {
    require('../helpers').apiCall.mockResolvedValueOnce({
      results: {
        active: true
      }
    }).mockResolvedValueOnce({
      results: {
        active: false
      }
    });

    const handleStopGame = jest.fn();
    render(<QuizGameAdmin handleStopGame={handleStopGame} />);
    const button = screen.getByText('Stop Game');
    button.click();

    await waitFor(() => expect(handleStopGame).toHaveBeenCalled());
    expect(require('../helpers').apiCall).toHaveBeenCalledWith('admin/quiz/1/end', 'POST', JSON.stringify({}));
  });
});
