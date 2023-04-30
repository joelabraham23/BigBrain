import React from 'react';
import { useParams } from 'react-router-dom';
import { apiCall } from '../helpers';
import { Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

export default function QuizResults () {
  const { playerId } = useParams()
  const [results, setResults] = React.useState()

  async function fetchPlayerResults () {
    const response = await apiCall(`play/${playerId}/results`, 'GET', JSON.stringify({}))
    setResults(response)
  }

  React.useEffect(() => {
    fetchPlayerResults()
  }, []);

  return (
    <div>
      <Typography variant="h3" style={{ textAlign: 'center' }}> Your Results! </Typography>
      {results && (
        <div>
          <Typography variant="h5"> Number of Correct Answers: {results.filter(result => result.correct).length}</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell> Question </TableCell>
                <TableCell> Answered Correctly </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell> Question {index + 1} </TableCell>
                  <TableCell> {result.correct ? 'Yes' : 'No'} </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Typography variant="body1">
      The score for each player is calculated as follows: the points earned for each question answered correctly are divided by the time taken to answer that question, and the results are summed for all questions answered correctly. The leaderboard shows the top 5 players by score.
      </Typography>
    </div>
  )
}
