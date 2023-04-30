import React from 'react';
import NavBar from './NavBar'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { RedirectToAuth, apiCall, fileToDataUrl } from '../helpers'
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Typography, Divider } from '@material-ui/core';
import QuestionDialog from './QuestionDialog.jsx';

// Page which shows all the questions in a quiz they can edit as well as they can add images or edit the name of the quiz
function EditQuiz () {
  const navigate = useNavigate()
  const [quizInfo, setQuizInfo] = React.useState({});
  const [newQuizName, setNewQuizName] = React.useState('');
  const [newQuizThumbnail, setNewQuizThumbnail] = React.useState(null);
  const [questionDialog, setQuestionDialog] = React.useState(false);
  const { quizId } = useParams();
  RedirectToAuth(`quiz/${quizId}/edit`)

  const handleQuestionDialogOpen = () => {
    setQuestionDialog(true);
  };

  const handleQuestionDialogClose = () => {
    setQuestionDialog(false);
  };

  async function fetchQuizInfo () {
    const response = await apiCall(`admin/quiz/${quizId}`, 'GET', JSON.stringify({}));
    setQuizInfo(response);
  }
  React.useEffect(async () => {
    await fetchQuizInfo();
  }, []);

  const handleNameChange = (event) => {
    setQuizInfo({ ...quizInfo, name: event.target.value });
    setNewQuizName(event.target.value);
  };

  async function submitEdit () {
    await apiCall(`admin/quiz/${quizId}`, 'PUT', JSON.stringify({
      name: newQuizName,
      thumbnail: newQuizThumbnail
    }))
    navigate('/dashboard');
  }

  async function deleteQuestion (questionId) {
    const updatedQuestions = quizInfo.questions.filter((question) => question.questionId !== questionId);
    apiCall(`admin/quiz/${quizId}`, 'PUT', JSON.stringify({
      questions: updatedQuestions
    }));
    await fetchQuizInfo()
  }
  async function uploadImage (event) {
    const file = event.target.files[0];
    try {
      const dataURL = await fileToDataUrl(file);
      setNewQuizThumbnail(dataURL);
      // return dataURL
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
    <NavBar />
    <Typography variant="h5" style={{ textAlign: 'center' }}>Edit Quiz</Typography>
    <Divider></Divider>
    <br />
    <Typography variant="h6">
        <span>Name:</span>
        <span>&nbsp;&nbsp;</span>
        <input type="text" value={quizInfo.name} onChange={handleNameChange} />
    </Typography>
    <br />
    <Typography variant="h6">
        <span>Thumbnail:</span>
        <span>&nbsp;&nbsp;</span>
        <input type="file" accept="image/png" onChange={uploadImage}/>
    </Typography>
    <br />
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
    }}>
      <Button style={{ margin: '10px' }} size="large" variant="contained" color="primary" onClick={handleQuestionDialogOpen}>Create a Question</Button>
      <Button style={{ margin: '10px' }} size="large" variant="contained" color="primary" onClick={submitEdit}>Save Changes</Button>
    </div>
    <br />
    <Typography variant="h5" style={{ textAlign: 'center' }}>Questions</Typography>
    <br />
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'center' }}>
    {quizInfo.questions && quizInfo.questions.map((question, index) => (
        <>
        <Card key={index} sx={{ maxWidth: 500, width: 300 }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Question {index + 1}: {question.question}
            </Typography>
            <Typography variant="body1">
              Time: {question.timeLimit} seconds
            </Typography>
            <Typography variant="body1">
              Type: {question.type ? 'Multiple Choice' : 'Single Choice'}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" variant="contained" color="primary" onClick={() => {
              navigate(`/quiz/${quizId}/edit/${question.questionId}`);
            } }>
              Edit
            </Button>
            <Button size="small" variant="contained" color="primary" onClick={() => deleteQuestion(question.questionId)}>Delete</Button>
          </CardActions>
        </Card></>
    ))}
    </div>
    <br />
    <QuestionDialog
      onClose={handleQuestionDialogClose}
      dialog={questionDialog}
      quizId={quizId}
      fetchQuizInfo={fetchQuizInfo}
    />
    </>

  );
}

export default EditQuiz;
