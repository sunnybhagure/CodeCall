import '../App.css';
import { Link } from 'react-router-dom';

export default function Landing() {
  return <div className="landingContainer">
    <nav>
      <div className="logo">
        <h1>CodeCall</h1>
      </div>
      <div className="navlist">
        <Link to="/auth">Join as Guest</Link>
        <Link to="/auth">Register</Link>
        <Link to="/auth" className="loginButton">
          <p>Login</p>
        </Link>
      </div>
    </nav>
    <div className="landingContent">
      <div>
        <h2>Welcome to CodeCall</h2>
        <p>Your platform for coding challenges and interviews.</p>
        <Link to="/auth" role="button" className="getStartedButton">
          <p>Get Started</p>
        </Link>
      </div>
      <div className="landingImage">
        <img src="/mobile.png" alt="Mobile App" />
      </div>
    </div>
  </div>;
}
