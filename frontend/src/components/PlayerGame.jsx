import React from 'react';
import Snake from 'snake-game-react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiCall } from '../helpers'
import { Typography } from '@material-ui/core';
import GameQuestion from './GameQuestion';
import ReactPlayer from 'react-player';

export function Video ({ videoUrl }) {
  return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
      <ReactPlayer url={videoUrl} controls={true} />
      </div>
  );
}

function PlayerGame () {
  const { sessionId, playerId } = useParams()
  const [CurrentQuestion, setCurrentQuestion] = React.useState({});
  const [remainingTime, setRemainingTime] = React.useState(1);
  const [SelectedAnswers, setSelectedAnswers] = React.useState([]);
  const navigate = useNavigate()

  async function fetchCurrentQuestion () {
    const response = await apiCall(`play/${playerId}/question`, 'GET', JSON.stringify({}), false);
    if (response.error) {
      navigate(`/play/results/${playerId}`);
    }
    setCurrentQuestion(response);
  }
  async function submitAnswers () {
    await apiCall(`play/${playerId}/answer`, 'PUT', JSON.stringify({
      answerIds: SelectedAnswers
    }))
  }

  React.useEffect(() => {
    const intervalId = setInterval(async () => {
      const response = await apiCall(`play/${playerId}/status`, 'GET', JSON.stringify({}), false);
      if (response.error) {
        navigate(`/play/results/${playerId}`);
      } else if (response.started) {
        fetchCurrentQuestion();
      }
    }, 1000);
    return () => {
      clearInterval(intervalId);
    }
  }, []);

  React.useEffect(() => {
    setSelectedAnswers([]);
  }, [CurrentQuestion.question?.questionId]);

  React.useEffect(() => {
    if (CurrentQuestion.question) {
      let countdown = CurrentQuestion.question.timeLimit;
      const intervalId = setInterval(() => {
        countdown--;
        setRemainingTime(countdown);
        if (countdown === 0) {
          clearInterval(intervalId);
        }
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [CurrentQuestion.question?.questionId]);

  React.useEffect(() => {
    if (remainingTime !== 0 && SelectedAnswers.length > 0) {
      submitAnswers();
    }
  }, [SelectedAnswers]);

  function getColor (index) {
    const colors = ['#FF9800', '#2196F3', '#4CAF50', '#E91E63', '#9C27B0', '#00BCD4'];
    return colors[index];
  }
  function handleClickAnswers (event) {
    if (remainingTime === 0) {
      return;
    }
    const value = event.currentTarget.getAttribute('value');
    const index = SelectedAnswers.indexOf(value.toString());
    if (index === -1) {
      if (CurrentQuestion.question.type === 'single-answer') {
        document.querySelectorAll('[value]').forEach((element) => {
          if (element.getAttribute('value') === value) {
            // element.style.backgroundColor = '#808080';
            element.style.transform = 'scale(1.15)';
          } else {
            element.style.backgroundColor = getColor(element.getAttribute('value'));
            element.style.transform = 'scale(1)';
            element.style.boxShadow = 'none';
          }
        });
        setSelectedAnswers([value]);
      } else {
        setSelectedAnswers([...SelectedAnswers, value]);
        event.currentTarget.style.transform = 'scale(1.15)';
        // event.currentTarget.style.backgroundColor = '#808080';
      }
    } else {
      if (SelectedAnswers.length > 1) {
        setSelectedAnswers(SelectedAnswers.filter(item => item !== value));
        event.currentTarget.style.transform = 'scale(1)';
        event.currentTarget.style.boxShadow = 'none';
        event.currentTarget.style.backgroundColor = getColor(value);
      }
    }
  }
  function handleAnswersEnter (event) {
    if (remainingTime === 0) {
      return;
    }
    const value = event.currentTarget.getAttribute('value');
    const index = SelectedAnswers.indexOf(value.toString());
    if (index === -1) {
      event.currentTarget.style.transform = 'scale(1.05)';
      event.currentTarget.style.boxShadow = '0px 10px 10px rgba(0, 0, 0, 0.25)';
    }
  }

  function handleAnswersLeave (event) {
    if (remainingTime === 0) {
      return;
    }
    const value = event.currentTarget.getAttribute('value');
    const index = SelectedAnswers.indexOf(value.toString());
    if (index === -1) {
      event.currentTarget.style.transform = 'scale(1)';
      event.currentTarget.style.boxShadow = 'none';
    }
  }
  return (
    <>
      <Typography style={{ fontWeight: 'bold' }}>SessionID: {sessionId} PlayerID: {playerId} </Typography>
      {CurrentQuestion.question
        ? <GameQuestion CurrentQuestion={CurrentQuestion} handleAnswersEnter={handleAnswersEnter} handleAnswersLeave={handleAnswersLeave} handleClickAnswers={handleClickAnswers} remainingTime={remainingTime} />
        : <div>
          <Typography variant="h2" style={{ textAlign: 'center' }}> Please Wait For Quiz To Start! 😊 </Typography>
          <Typography variant="h5" style={{ textAlign: 'center' }}> Enjoy this while you wait! </Typography>
          <br />
          <Snake
            color1="#248ec2"
            color2="#1d355e"
            backgroundColor="#ebebeb"
          />
        </div>
        }
      <br />
    </>
  );
}

export default PlayerGame;
