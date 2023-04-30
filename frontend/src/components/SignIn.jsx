import React from 'react';
import { useNavigate } from 'react-router';
import { apiCall, RedirectToDash } from '../helpers';
import {
  TextField,
  Button,
} from '@material-ui/core';
import { Link } from 'react-router-dom';

function SignIn () {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
  // If user is already logged in and tries to access the signin page
  RedirectToDash('signin')

  async function login () {
    const response = await apiCall('admin/auth/login', 'POST', JSON.stringify({
      email,
      password,
    }))
    localStorage.setItem('token', response.token);
    navigate('/Dashboard');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>BigBrain.com</h1>
      <form>
      <TextField
        style={{ width: '200px', margin: '5px' }}
        type="email"
        label="email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <TextField
        style={{ width: '200px', margin: '5px' }}
        type="password"
        label="Password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      </form>
      <Button onClick={login} variant="contained" color="primary">
        Sign In
      </Button>
      <div>Not a member?<span><Link to="/signup">Sign Up</Link></span></div>
    </div>
  )
}

export default SignIn;
