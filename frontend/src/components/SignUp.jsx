import React from 'react';
import { apiCall, RedirectToDash } from '../helpers';
import { useNavigate } from 'react-router';
import {
  TextField,
  Button,
} from '@material-ui/core';
import { Link } from 'react-router-dom';

function SignUp () {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const navigate = useNavigate();
  // If the user is already locgged in and tries to access the signup page
  RedirectToDash('signup')

  async function register () {
    const response = await apiCall('admin/auth/register', 'POST', JSON.stringify({
      email,
      password,
      name,
    }))
    await localStorage.setItem('token', response.token);
    navigate('/Dashboard');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>BigBrain.com</h1>
      <form>
      <TextField
        style={{ width: '200px', margin: '5px' }}
        type="text"
        label="Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
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
      <Button onClick={register} variant="contained" color="primary">
        Sign Up
      </Button>
      <div>Already a member?<span><Link to="/signin">Sign In</Link></span></div>
    </div>
  )
}

export default SignUp;
