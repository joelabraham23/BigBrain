import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';

// Table showing a leaderboard of the top 5 players and their scores
const LeaderboardTable = ({ leaderboard }) => {
  // Get the top 5 players
  const top5 = leaderboard.slice(0, 5);

  return (
    <div>
        <Typography variant="h5" component="h2" align="center" gutterBottom>
        Leaderboard
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <caption>
            <Box mt={1} mb={2}>
            <Typography variant="body2" color="text.secondary" align="center">
              Score calculation: The quicker a player answers, the more points they receive. The higher a question&apos;s point value, the more points awarded for that question.
            </Typography>
            <br />
            <Typography variant="body3" color="text.secondary" align="center">
              The score for each player is calculated as follows: the points earned for each question answered correctly are divided by the time taken to answer that question, and the results are summed for all questions answered correctly. The leaderboard shows the top 5 players by score.
            </Typography>
            </Box>
          </caption>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {top5.map((player, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{player.name}</TableCell>
                <TableCell>{player.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default LeaderboardTable;
