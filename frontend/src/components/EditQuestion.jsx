import React from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { RedirectToAuth, apiCall, fileToDataUrl } from '../helpers';
import { Typography, Button } from '@material-ui/core';

function EditQuestion () {
  const navigate = useNavigate();
  const { quizId, questionId } = useParams();
  const [QuestionType, setQuestionType] = React.useState('');
  const [Question, setQuestion] = React.useState('');
  const [Points, setPoints] = React.useState('');
  const [TimeLimit, setTimeLimit] = React.useState('');
  const [URL, setURL] = React.useState('');
  const [Photo, setPhoto] = React.useState();
  const [Answers, setAnswers] = React.useState([]);
  const [checkedAnswers, setCheckedAnswers] = React.useState([]);

  RedirectToAuth(`quiz/${quizId}/edit/${questionId}`)
  async function fetchQuizInfo () {
    apiCall(`admin/quiz/${quizId}`, 'GET', JSON.stringify({}));
  }
  React.useEffect(async () => {
    await fetchQuizInfo();
  }, [createQuestion]);

  React.useEffect(async () => {
    const quiz = await apiCall(`admin/quiz/${quizId}`, 'GET', JSON.stringify({}));
    const question = quiz.questions.find((question) => question.questionId.toString() === questionId.toString());
    // setOriginalQuestion(question)
    setQuestionType(question.type)
    setQuestion(question.question)
    setPoints(question.points)
    setTimeLimit(question.timeLimit)
    setURL(question.url)
    setPhoto(question.photo)
    setAnswers(question.answers)
    setCheckedAnswers(question.checkedAnswers)
  }, [])

  async function createQuestion () {
    const numCorrectAnswers = Object.values(checkedAnswers).filter((val) => val).length;
    if (QuestionType === 'single-answer' && numCorrectAnswers > 1) {
      // setErrorMessage('Single choice questions can only have one correct answer');
      alert('Single choice questions can only have one correct answer')
      setCheckedAnswers([]);
      return;
    } else if (QuestionType === '') {
      // setErrorMessage('Question Type can not be empty');
      alert('Question Type can not be empty')
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
      alert('You must either upload a Photo or URL');
      return;
    } else if (numCorrectAnswers === 0) {
      alert('You must select a correct answer')
      return;
    } else if (Object.values(Answers).filter((value) => value !== '').length < 2) {
      alert('You must have at least two answers')
      return;
    }

    const quiz = await apiCall(`admin/quiz/${quizId}`, 'GET', JSON.stringify({}));
    const questionIndex = quiz.questions.findIndex((question) => question.questionId.toString() === questionId.toString());
    const newQuestion = {
      questionId,
      type: QuestionType,
      question: Question,
      points: Points,
      timeLimit: parseInt(TimeLimit),
      url: URL,
      photo: Photo,
      answers: Answers,
      checkedAnswers
    };
    const questionList = [...quiz.questions];
    questionList[questionIndex] = newQuestion;
    await apiCall(`admin/quiz/${quizId}`, 'PUT', JSON.stringify({
      questions: questionList
    }));
    navigate(`/quiz/${quizId}/edit`);
    await fetchQuizInfo();
  }

  const answerOptions = [
    { label: 'Answer 1', value: '' },
    { label: 'Answer 2', value: '' },
    { label: 'Answer 3', value: '' },
    { label: 'Answer 4', value: '' },
    { label: 'Answer 5', value: '' },
    { label: 'Answer 6', value: '' },
  ];
  async function uploadImage (event) {
    const file = event.target.files[0];
    try {
      const dataURL = await fileToDataUrl(file);
      setPhoto(dataURL);
      // return dataURL
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <div>Question Type:</div>
      <ul style={{ display: 'flex', alignItems: 'center', margin: 0, padding: 0, listStyleType: 'none' }}>
        <div><input type="radio" name="questionType" checked={QuestionType === 'single-answer'} value="single-answer" style={{ width: '15px', height: '15px' }} onChange={(e) => setQuestionType(e.target.value)} /></div>
        <div style={{ paddingLeft: '5px', paddingRight: '55px' }}>Single Answer</div>
        <div><input type="radio" name="questionType" checked={QuestionType === 'multiple-answer'} value="multiple-answer" style={{ width: '15px', height: '15px' }} onChange={(e) => setQuestionType(e.target.value)} /></div>
        <div style={{ paddingLeft: '5px' }}>Multiple Answer</div>
      </ul>
      <br />
      <Typography style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ width: '100px' }}>Question:</span>
      <input type="text"value={Question}style={{ flex: '1' }} onChange={(e) => setQuestion(e.target.value)} />
      </Typography>
      <br />
      <Typography style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ width: '100px' }}>Time Limit (seconds):</span>
      <input type="text" value={TimeLimit} pattern="\d" style={{ flex: '1' }} onChange={(e) => setTimeLimit(e.target.value)} />
      </Typography>
      <br />
      <Typography style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ width: '100px' }}>Points:</span>
        <input type="text" value={Points} label="Required" pattern="\d" style={{ flex: '1' }} onChange={(e) => setPoints(e.target.value)} />
      </Typography>
      <br />
      <Typography style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ width: '100px' }}>Upload file (optional):</span>
        <input type="file" style={{ flex: '1' }} onChange={uploadImage} />
      </Typography>
      <Typography style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ width: '100px' }}>Upload URL (optional):</span>
        <input type="text" value={URL} style={{ flex: '1' }} onChange={(e) => setURL(e.target.value)} />
      </Typography>
      <br />
      <ul style={{ margin: 0, padding: 0, listStyleType: 'none' }}>
        {answerOptions.map((option, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '100px' }}>{option.label}:</span>
            <input type="text" style={{ flex: '1' }} value={Answers[index]} onChange={(e) => setAnswers({ ...Answers, [index]: e.target.value })} />
            <li style={{ paddingLeft: '15px', paddingTop: '5px' }}>
            <input type="checkbox" style={{ width: '20px', height: '20px' }} checked={checkedAnswers[index]} onChange={(e) => setCheckedAnswers({ ...checkedAnswers, [index]: e.target.checked })} name={option.label} />
            </li>
          </div>
        ))}
      </ul>
      <span >
        <Button variant='contained' color='primary' onClick={() => { navigate(`/quiz/${quizId}/edit`) }}>Cancel</Button>
        <Button variant='contained' color='primary' onClick={createQuestion}>Submit</Button>
      </span>
    </div>
  );
}

export default EditQuestion;
