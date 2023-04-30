import React from 'react'
import NavBar from './NavBar'
import { RedirectToAuth, apiCall } from '../helpers'
import { useParams } from 'react-router-dom';
import QuizActive from './QuizActive';
import QuizResults from './QuizResults';

// The admin page for a user to view the game as well as see the results
function QuizGameAdmin () {
  const [gameActive, setgameActive] = React.useState(null);
  const [gameStatus, setGameStatus] = React.useState({});

  const { quizId, sessionId } = useParams();
  RedirectToAuth(`quiz/${quizId}/${sessionId}`);

  async function fetchSessionStatus () {
    const response = await apiCall(`admin/session/${sessionId}/status`, 'GET', JSON.stringify({}))
    setGameStatus(response.results)
    setgameActive(response.results.active)
  }

  async function handleNextQuestion () {
    await apiCall(`admin/quiz/${quizId}/advance`, 'POST', JSON.stringify({}))
    await fetchSessionStatus()
  }

  async function handleStopGame () {
    setgameActive(false)
    await apiCall(`admin/quiz/${quizId}/end`, 'POST', JSON.stringify({}))
    await fetchSessionStatus()
  }

  React.useEffect(() => {
    fetchSessionStatus();
  }, []);

  if (gameActive === null) {
    return <div>Loading page..</div>
  }

  return (
    <>
      <NavBar />
      {gameActive
        ? <QuizActive gameStatus={gameStatus} sessionId={sessionId} handleNextQuestion={handleNextQuestion} handleStopGame={handleStopGame} />
        : <QuizResults quizId={quizId} sessionId={sessionId} />}
    </>
  );
}

export default QuizGameAdmin;
