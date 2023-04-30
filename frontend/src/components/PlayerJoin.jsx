import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiCall } from '../helpers'
import { TextField, Button } from '@material-ui/core'

export default function PlayerJoin () {
  const { sessionId } = useParams()
  const [name, setName] = React.useState('')
  const navigate = useNavigate();

  async function joinGame () {
    const response = await apiCall(`play/join/${sessionId}`, 'POST', JSON.stringify({
      name
    }))
    navigate(`/play/${sessionId}/${response.playerId}`)
  }
  return (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100vh'
    }}>
    <TextField
    id="outlined-basic"
    label="Name"
    variant="outlined"
    value={name}
    onChange={(e) => setName(e.target.value)}/>
    <br />
    <Button onClick={joinGame} variant="contained" color="primary">
      Play Game
    </Button>
  </div>
  )
}
