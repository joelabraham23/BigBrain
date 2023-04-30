import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { apiCall } from '../helpers';
import { useNavigate } from 'react-router';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// A Navigation bar that will always give users an option to go to dashboard or log out,
// If a user is on the dashboard page then they can also add game from the navBar
export default function NavBar ({ onAddGameClick }) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [newQuizName, setNewQuizName] = React.useState('');

  // Logout a user and remove their token
  function logout () {
    apiCall('admin/auth/logout', 'POST', JSON.stringify({}))
    localStorage.removeItem('token')
    navigate('/signin');
  }

  function handleClickOpen () {
    setOpen(true);
  }

  function handleClose () {
    setOpen(false);
  }

  function handleAddGame () {
    onAddGameClick();
    handleClose();
    apiCall('admin/quiz/new', 'POST', JSON.stringify({
      name: newQuizName,
    }))
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BigBrain
          </Typography>
          <Button onClick={() => {
            navigate('/dashboard')
          }} color="inherit">Dashboard</Button>
          {onAddGameClick && (
            <Button onClick={handleClickOpen} color="inherit">Add Game</Button>
          )}
          <Button onClick={logout} color="inherit">LogOut</Button>
        </Toolbar>
      </AppBar>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Game</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Game Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setNewQuizName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddGame}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
