import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import QuizGameAdmin from './components/QuizGameAdmin';
import EditQuiz from './components/EditQuiz';
import EditQuestion from './components/EditQuestion';
import PlayerJoin from './components/PlayerJoin'
import PlayerGame from './components/PlayerGame'
import { RedirectToAuth } from './helpers';
import PlayerResults from './components/PlayerResults';
export default function App () {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<RedirectToAuth page="dashboard" />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz/:quizId/:sessionId" element={<QuizGameAdmin />} />
          <Route path="/quiz/:quizId/edit" element={<EditQuiz/>} />
          <Route path="/quiz/:quizId/edit/:questionId" element={<EditQuestion/>} />
          <Route path="/play/join/:sessionId" element={<PlayerJoin/>} />
          <Route path="/play/:sessionId/:playerId" element={<PlayerGame/>} />
          <Route path="/play/results/:playerId" element={<PlayerResults/>} />
        </Routes>
    </BrowserRouter>
  )
}
