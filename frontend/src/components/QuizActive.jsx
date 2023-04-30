import React from 'react';
import { apiCall } from '../helpers';
import { Button, Typography, Divider } from '@material-ui/core';

// Component for when the quiz is active for admin to be able to advance the screen or
// stop the game as well as see other information like what players have joined
export default function QuizActive ({ gameStatus, sessionId, handleNextQuestion, handleStopGame }) {
  const [playersJoined, setplayersJoined] = React.useState([]);
  React.useEffect(() => {
    const intervalId = setInterval(async () => {
      const response = await apiCall(`admin/session/${sessionId}/status`, 'GET', JSON.stringify({}));
      setplayersJoined(response.results.players)
    }, 1000);
    return () => {
      clearInterval(intervalId);
    }
  }, []);
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {gameStatus.questions[gameStatus.position]?.question
          ? <React.Fragment>
              <Button style={{ margin: '10px' }} size="large" variant="contained" color="primary" onClick={handleNextQuestion}>Next Question</Button>
              <Typography variant="h4">{gameStatus.questions[gameStatus.position].question}</Typography>
            </React.Fragment>
          : <React.Fragment>
              <Button style={{ margin: '10px' }} size="large" variant="contained" color="primary" onClick={handleNextQuestion}>Start Game</Button>
              <Typography variant="h4">{sessionId}</Typography>
            </React.Fragment>
        }
        <Button style={{ margin: '10px' }} size="large" variant="contained" color="primary" onClick={handleStopGame}>Stop Game</Button>
      </div>
      {!gameStatus.questions[gameStatus.position]?.question && <LargeCopyToClipboardButton sessionId={sessionId}/>}
      <br />
      <Divider></Divider>
      <Typography variant="h5">Question: {gameStatus.position + 1}/{gameStatus.questions.length}</Typography>
      <br />
      {playersJoined.length > 0
        ? (<div>
          <Typography variant="h6">Players Joined</Typography>
         <ul>
            {playersJoined.map(player => (
              <li key={player}>{player}</li>
            ))}
          </ul>
        </div>)

        : (<Typography variant="body1">No players have joined yet.</Typography>)}
    </>
  );
}

// A large copy to clipboard Button for admin to share the link to join the game
const LargeCopyToClipboardButton = ({ sessionId }) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const handleClick = () => {
    navigator.clipboard.writeText(event.view.location.origin + `/play/join/${sessionId}`)
    setIsCopied(true)
  }
  return (
      <Button
      style={{ margin: '10px', width: '95%' }}
      size="large"
      variant="contained"
      color="primary"
      onClick={handleClick}>{isCopied ? 'Copied!' : 'Copy Link'}</Button>
  )
}
