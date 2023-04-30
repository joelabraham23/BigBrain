import React from 'react';
import NavBar from './NavBar'
import { apiCall, RedirectToAuth } from '../helpers';
import QuizCard from './QuizCard';

// Creates a Dashboard displaying all the current quizzes made as well as an option to create a new game
function Dashboard () {
  const [quizzes, setQuizzes] = React.useState([]);
  const [addGameClicked, setaddGameClicked] = React.useState(false);

  RedirectToAuth('dashboard');
  // Retrieving information about all quizzes available
  async function fetchAllQuizzes () {
    const response = await apiCall('admin/quiz', 'GET', {})
    setQuizzes(response.quizzes);
  }

  // Whenever a game is added fetch all the quizzes in the dashboard
  React.useEffect(async () => {
    await fetchAllQuizzes();
  }, [addGameClicked]);

  return (
  <div>
    <NavBar onAddGameClick={() => setaddGameClicked(!addGameClicked)}></NavBar>
    <div
    style={{
      marginTop: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: '20px'
    }}>
      <br />
      {quizzes && quizzes.map(quiz => (
        <QuizCard
        key={quiz.id}
        quizId={quiz.id}
        fetchAllQuizzes={fetchAllQuizzes}/>
      ))}

      <br /><hr /><br />
    </div>;
  </div>)
}

export default Dashboard;
