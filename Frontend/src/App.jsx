import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing.jsx';
import AuthenticationPage from './pages/authentication.jsx';
import { AuthProvider } from './contexts/AuthContext';
import VideoMeet from './pages/videoMeet.jsx';
import HomePage from './pages/home.jsx';
import HistoryPage from './pages/history.jsx';
import InterviewRoom from './pages/interviewRoom.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthenticationPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/history" element={<HistoryPage />} />
<Route
    path="/interview/:interviewId"
    element={<InterviewRoom />}
/>            <Route path="/:url" element={<VideoMeet />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router> 
  );
}

export default App;
