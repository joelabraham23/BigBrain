import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuizResults from './QuizResults';

jest.mock('../helpers');

describe('QuizResults', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders the "Go Home" button', () => {
    render(<QuizResults quizId={1} sessionId={1} />);
    const goHomeButton = screen.getByRole('button', { name: 'Go Home' });
    expect(goHomeButton).toBeInTheDocument();
  });

  it('redirects to the dashboard when "Go Home" button is clicked', () => {
    const navigateMock = jest.fn();
    jest.mock('react-router-dom', () => ({
      useNavigate: () => navigateMock,
    }));
    render(<QuizResults quizId={1} sessionId={1} />);
    const goHomeButton = screen.getByRole('button', { name: 'Go Home' });
    userEvent.click(goHomeButton);
    expect(navigateMock).toHaveBeenCalledWith('/dashboard');
  });

  it('displays the leaderboard table when data is available', async () => {
    const mockLeaderboard = [
      { name: 'Alice', score: 10 },
      { name: 'Bob', score: 20 },
      { name: 'Charlie', score: 15 },
    ];
    jest.mock('../helpers', () => ({
      apiCall: () => Promise.resolve({
        questions: [{ points: 1 }, { points: 2 }, { points: 3 }],
      }),
    }));
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: () => Promise.resolve({
        results: [{ name: 'Alice', answers: [] }, { name: 'Bob', answers: [] }, { name: 'Charlie', answers: [] }],
      }),
    });
    render(<QuizResults quizId={1} sessionId={1} />);
    expect(await screen.findByText('Leaderboard')).toBeInTheDocument();
    mockLeaderboard.forEach(({ name, score }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
      expect(screen.getByText(score)).toBeInTheDocument();
    });
  });

  it('displays the percentage bar chart when data is available', async () => {
    const mockData = [
      { question: 'Q1', percentage: 50 },
      { question: 'Q2', percentage: 75 },
      { question: 'Q3', percentage: 25 },
    ];
    jest.mock('../helpers', () => ({
      apiCall: () => Promise.resolve({
        questions: [{ points: 1 }, { points: 2 }, { points: 3 }],
      }),
    }));
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: () => Promise.resolve({
        results: [{ name: 'Alice', answers: [] }, { name: 'Bob', answers: [] }, { name: 'Charlie', answers: [] }],
      }),
    });
    render(<QuizResults quizId={1} sessionId={1} />);
    expect(await screen.findByText('Percentage of correct answers')).toBeInTheDocument();
    mockData.forEach(({ question, percentage }) => {
      expect(screen.getByText(question)).toBeInTheDocument();
      expect(screen.getByText(`${percentage}%`)).toBeInTheDocument();
    });
  });
});