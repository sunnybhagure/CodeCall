import '../App.css';
import { Link } from 'react-router-dom';

export default function Landing() {
  return <div className="landingContainer">
    <nav>
      <div className="logo">
        <h1>CodeCall</h1>
      </div>
      <div className="navlist">
        <p>Join as Guest</p>
        <p>Register</p>
        <div role="button" className="loginButton">
          <p>Login</p>
        </div>
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
