import React from 'react';
import { Typography, Button, DialogActions, Box } from '@material-ui/core';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { apiCall } from '../helpers'

export default function QuestionDialog ({ onClose, dialog, quizId, fetchQuizInfo }) {
  const [QuestionType, setQuestionType] = React.useState('');
  const [Question, setQuestion] = React.useState('');
  const [Points, setPoints] = React.useState('');
  const [TimeLimit, setTimeLimit] = React.useState('');
  const [URL, setURL] = React.useState('');
  const [Answers, setAnswers] = React.useState([]);
  const [checkedAnswers, setCheckedAnswers] = React.useState([]);
  const [Photo, setPhoto] = React.useState();
  const handleClose = () => {
    onClose();
    setCheckedAnswers([]);
    setAnswers([]);
    setQuestionType('');
  };

  React.useEffect(async () => {
    fetchQuizInfo()
  }, [dialog]);

  async function createQuestion () {
    const numCorrectAnswers = Object.values(checkedAnswers).filter((val) => val).length;
    if (QuestionType === 'single-answer' && numCorrectAnswers > 1) {
      alert('Single choice questions can only have one correct answer');
      setCheckedAnswers([]);
      return;
    } else if (QuestionType === '') {
      alert('Question Type can not be empty');
      return;
    } else if (TimeLimit === '' || !Number.isInteger(Number(TimeLimit))) {
      alert('Time Limit must have an integer value');
      return;
    } else if (Points === '' || !Number.isInteger(Number(Points))) {
      alert('Points must have an integer value');
      return;
    } else if (Question === '') {
      alert('Question can not be empty');
      return;
    } else if (URL && Photo) {
      alert('You must either upload a photo or URL');
      return;
    } else if (numCorrectAnswers === 0) {
      alert('You must select a correct answer')
      return;
    } else if (Object.values(Answers).filter((value) => value !== '').length < 2) {
      alert('You must have at least two answers')
      return;
    }
    const quiz = await apiCall(`admin/quiz/${quizId}`, 'GET', JSON.stringify({}));
    const newQuestion = {
      questionId: Date.now(),
      type: QuestionType,
      question: Question,
      points: Points,
      timeLimit: parseInt(TimeLimit),
      url: URL,
      photo: Photo,
      answers: Answers,
      checkedAnswers
    };
    const questionList = [...quiz.questions, newQuestion];
    await apiCall(`admin/quiz/${quizId}`, 'PUT', JSON.stringify({
      questions: questionList
    }));
    handleClose();
    setPhoto('');
    setURL('');
  }
  const answerOptions = [
    { label: 'Answer 1', value: '' },
    { label: 'Answer 2', value: '' },
    { label: 'Answer 3', value: '' },
    { label: 'Answer 4', value: '' },
    { label: 'Answer 5', value: '' },
    { label: 'Answer 6', value: '' },
  ];
  return (
    <Dialog onClose={handleClose} open={dialog}>
      <DialogTitle>Create a Question</DialogTitle>
      <Box style={{ paddingLeft: 20 }}>
        <Typography style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography>
            <span style={{ width: '100px' }}>Question Type:</span>
          <ul style={{ display: 'flex', alignItems: 'center', margin: 0, padding: 0, listStyleType: 'none' }}>
            <li><input type="radio" name="questionType" value="single-answer" style={{ width: '15px', height: '15px' }} onChange={(e) => setQuestionType(e.target.value)} /></li>
            <li style={{ paddingLeft: '5px', paddingRight: '55px' }}>Single Answer</li>
            <li><input type="radio" name="questionType" value="multiple-answer" style={{ width: '15px', height: '15px' }} onChange={(e) => setQuestionType(e.target.value)} /></li>
            <li style={{ paddingLeft: '5px' }}>Multiple Answer</li>
          </ul>
          </Typography>
          <br />
          <Typography style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '100px' }}>Question:</span>
            <input type="text" style={{ flex: '1' }} onChange={(e) => setQuestion(e.target.value)} />
          </Typography>
          <br />
          <Typography style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '100px' }}>Time Limit (seconds):</span>
            <input type="text" label="Required" pattern="\d" style={{ flex: '1' }} onChange={(e) => setTimeLimit(e.target.value)} />
          </Typography>
          <br />
          <Typography style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '100px' }}>Points:</span>
            <input type="text" label="Required" pattern="\d" style={{ flex: '1' }} onChange={(e) => setPoints(e.target.value)} />
          </Typography>
          <br />
          <Typography style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '100px' }}>Upload file (optional):</span>
            <input type="file" style={{ flex: '1' }} onChange={(e) => setPhoto(e.target.value)} />
          </Typography>
          <Typography style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '100px' }}>Upload URL (optional):</span>
            <input type="text" style={{ flex: '1' }} onChange={(e) => setURL(e.target.value)} />
          </Typography>
          <br />
          <ul style={{ margin: 0, padding: 0, listStyleType: 'none' }}>
          {answerOptions.map((option, index) => (
           <Typography key={index} style={{ display: 'flex', alignItems: 'center' }}>
           <span style={{ width: '100px' }}>{option.label}:</span>
             <input type="text" style={{ flex: '1' }} value={Answers[index]} onChange={(e) => setAnswers({ ...Answers, [index]: e.target.value })} />
           <li style={{ paddingLeft: '15px', paddingTop: '5px' }}>
           <input type="checkbox" style={{ width: '20px', height: '20px' }} checked={checkedAnswers[index]} onChange={(e) => setCheckedAnswers({ ...checkedAnswers, [index]: e.target.checked })} name={option.label} />
           </li>
           </Typography>
          ))}
          </ul>
        </Typography>
      </Box>
      <DialogActions>
        <Button variant='contained' color='primary' onClick={handleClose}>Cancel</Button>
        <Button variant='contained' color='primary' onClick={createQuestion}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
