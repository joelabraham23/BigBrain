import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { apiCall } from '../helpers';
import { useNavigate } from 'react-router';
import GameDialog from './GameDialog';
import DeleteDialog from './DeleteDialog';

// A card to display specific informmation about a quiz as well as give options to delete or edit the quiz
export default function QuizCard ({ quizId, fetchAllQuizzes }) {
  const navigate = useNavigate();
  const [quizInfo, setQuizInfo] = React.useState({});
  const [gameDialog, setGameDialog] = React.useState(false);
  const [deleteQuiz, setDeleteQuiz] = React.useState(false);
  const [gameActive, setGameActive] = React.useState(false);
  const [recentSessionId, setRecentSessionId] = React.useState(null);

  const handleGameDialogOpen = () => {
    setGameDialog(true);
  };

  const handleGameDialogClose = () => {
    setGameDialog(false);
  };

  const handleDeleteOpen = () => {
    setDeleteQuiz(true);
  }

  const handleDeleteClose = () => {
    setDeleteQuiz(false);
  };

  // Make a quiz active
  async function activateGame () {
    await apiCall(`admin/quiz/${quizId}/start`, 'POST', JSON.stringify({}))
    await fetchQuizInfo()
    handleGameDialogOpen()
    setGameActive(true)
  }

  // Stop a game whenever needed from the dashboard
  async function stopGame () {
    setRecentSessionId(quizInfo.active)
    await apiCall(`admin/quiz/${quizId}/end`, 'POST', JSON.stringify({}))
    await fetchQuizInfo()
    setGameActive(false)
    handleGameDialogOpen()
  }

  // Fetch specifci information about the quiz
  async function fetchQuizInfo () {
    const response = await apiCall(`admin/quiz/${quizId}`, 'GET', JSON.stringify({}));
    setQuizInfo(response);
    setGameActive(response.active);
  }
  React.useEffect(async () => {
    await fetchQuizInfo();
  }, []);

  return (
    <b>
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt="Quiz Thunbnail"
        height="140"
        image={quizInfo.thumbnail ? quizInfo.thumbnail : 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png'}
        />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {quizInfo.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Created at: {quizInfo.createdAt}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Number of Questions: {quizInfo && quizInfo.questions ? quizInfo.questions.length : 0}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Time: {quizInfo && quizInfo.questions ? quizInfo.questions.reduce((acc, cur) => acc + cur.timeLimit, 0) : 0} seconds
        </Typography>
      </CardContent>
      <CardActions>
      <Button size="small" variant="contained" color="primary" onClick={gameActive ? handleGameDialogOpen : activateGame}>
        {gameActive ? 'View Game' : 'Activate Game'}
      </Button>
      <Button size="small" onClick={() => {
        navigate(`/quiz/${quizId}/edit`)
      }}>
        Edit
      </Button>
      <Button size="small" onClick={handleDeleteOpen}>
        Delete
      </Button>
      </CardActions>
    </Card>
    <GameDialog
      open={gameDialog}
      onClose={handleGameDialogClose}
      sessionId={quizInfo.active}
      gameActive={gameActive}
      stopGame={stopGame}
      quizId={quizId}
      recentSessionId={recentSessionId}
    />
    <DeleteDialog
      onClose={handleDeleteClose}
      dialog= {deleteQuiz}
      quizId={quizId}
      quizInfo={quizInfo}
      recentSessionId={recentSessionId}
      fetchAllQuizzes={fetchAllQuizzes}
    />
    <br />
    </b>
  );
}
