import { useNavigate } from 'react-router-dom';
import React from 'react';
import { Button, DialogActions } from '@material-ui/core';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

// Dialog to show admin the options for the game
export default function GameDialog ({ onClose, open, sessionId, gameActive, recentSessionId, quizId, stopGame }) {
  const navigate = useNavigate();
  const handleClose = () => {
    onClose();
  };
  // Take admin to game Screen
  const startGame = () => {
    navigate(`/quiz/${quizId}/${sessionId}`)
  }

  return (
    <Dialog onClose={handleClose} open={open}>
    <DialogTitle >
      {gameActive ? sessionId : 'Would you like to view the results?'}
    </DialogTitle>
    {gameActive
      ? (
        <>
          <CopyToClipboardButton sessionId={sessionId} />
          <Button onClick={startGame} >Game Screen</Button>
          <Button onClick={() => {
            stopGame()
          }}>Stop Game</Button>
        </>
        )
      : (
      <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={() => {
            handleClose()
            navigate(`/quiz/${quizId}/${recentSessionId}`)
          }}>Yes</Button>
      </DialogActions>
        )}
      </Dialog>
  );
}

// A button that when clicked will copy a link to the game for players to join
export const CopyToClipboardButton = ({ sessionId }) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const handleClick = () => {
    navigator.clipboard.writeText(event.view.location.origin + `/play/join/${sessionId}`)
    setIsCopied(true)
  }

  return (
      <Button onClick={handleClick}>{isCopied ? 'Copied!' : 'Copy Link'}</Button>
  )
}
