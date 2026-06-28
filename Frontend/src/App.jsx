import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing.jsx';
import AuthenticationPage from './pages/authentication.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthenticationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
