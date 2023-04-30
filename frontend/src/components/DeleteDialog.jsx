import React from 'react';
import { Button, DialogActions } from '@material-ui/core';
import { apiCall } from '../helpers';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

// Dialog to confirm whether an admin wants to delete a quiz
export default function DeleteDialog ({ onClose, dialog, quizId, quizInfo, fetchAllQuizzes }) {
  const handleClose = () => {
    onClose();
  };

  React.useEffect(async () => {
    fetchAllQuizzes()
  }, [dialog]);

  async function deleteQuiz () {
    await apiCall(`admin/quiz/${quizId}`, 'DELETE', JSON.stringify({}))
    handleClose();
  }
  return (
  <Dialog onClose={handleClose} open={dialog}>
    <DialogTitle>
      Are you sure you want to delete?
    </DialogTitle >
    <DialogActions>
      <Button onClick={handleClose}>No</Button>
      <Button onClick={deleteQuiz}>Yes</Button>
    </DialogActions>
  </Dialog>
  );
}
