import * as React from 'react';
import { Button } from '@material-ui/core'
import { useNavigate } from 'react-router-dom'
import { apiCall } from '../helpers'
import LeaderboardTable from './LeaderboardTable'
import PercentageBarChart from './PercentageBarChart'
import AverageTimeChart from './AverageTimeChart';

export default function QuizResults ({ quizId, sessionId }) {
  const navigate = useNavigate()
  const [leaderBoard, setLeaderBoard] = React.useState(null);
  const [percentageData, setPercentageData] = React.useState(null);
  const [averageTimePerQuestion, setAverageTimePerQuestion] = React.useState(null);
  // const [percentageData, setPercentageData] = React.useState([]);

  async function sortResults () {
    // How many points is each question worth
    const pointsPerQuestion = []
    const QuizResponse = await apiCall(`admin/quiz/${quizId}`, 'GET', JSON.stringify({}))
    QuizResponse.questions.forEach(element => {
      pointsPerQuestion.push(parseInt(element.points))
    });
    // A 2d array that will store all the times taken by each user for each question
    const timePerQuestion = new Array(QuizResponse.questions.length).fill(null).map(() => []);
    // Results from the current session
    const SessionResultsResponse = await apiCall(`admin/session/${sessionId}/results`, 'GET', JSON.stringify({}))
    const sessionResults = SessionResultsResponse.results
    const totalPlayers = sessionResults.length

    // Array to find out percentage of correct questions
    // Will add to the array according to question index if a player got it correct
    const correctAnswersPerQuestion = new Array(QuizResponse.questions.length).fill(0);

    const newLeaderBoard = []
    for (const player of sessionResults) {
      let score = 0
      for (const [index, answer] of player.answers.entries()) {
        const startTime = new Date(answer.answeredAt);
        const answerTime = new Date(answer.questionStartedAt)
        const timeDiff = (startTime - answerTime) / 1000
        // If the answer is correct then add the points divided by the time to their score
        if (answer.correct) {
          correctAnswersPerQuestion[index] += 1
          score += pointsPerQuestion[index] / timeDiff
          score = parseFloat(score.toFixed(2)); // Round the score to 2 decimal places
        }
        timePerQuestion[index].push(timeDiff)
      }
      newLeaderBoard.push({ name: player.name, score })
    }
    // Calculate the percentage of people getting each question correct
    const newPercentageData = correctAnswersPerQuestion.map((correct, index) => {
      const percentage = (correct / totalPlayers) * 100;
      return { question: `Q${index + 1}`, percentage: parseFloat(percentage.toFixed(2)) };
    });
    setPercentageData(newPercentageData);

    // Calculate the average time taken per question
    const newAverageTimePerQuestion = timePerQuestion.map(times => {
      const sum = times.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      const average = sum / totalPlayers;
      return average;
    });
    setAverageTimePerQuestion(newAverageTimePerQuestion)

    // Sorting out the leaderboard in descending order
    newLeaderBoard.sort((a, b) => b.score - a.score);
    setLeaderBoard(newLeaderBoard);
  }

  React.useEffect(async () => {
    await sortResults()
  }, []);

  return (
    <>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Button style={{ margin: '10px' }} size="large" variant="contained" color="primary" onClick={() => { navigate('/dashboard') }}>Go Home</Button>
    </div>
    <br />
    {leaderBoard && <LeaderboardTable leaderboard={leaderBoard} />}
    <br />
    {percentageData && <PercentageBarChart data={percentageData} />}
    <br />
    {averageTimePerQuestion && <AverageTimeChart data={averageTimePerQuestion}/>}
    </>
  )
}
