
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import '../styles/global.css';
const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/signup', { username, password });
      router.push('/login');
    } catch (err) {
      setError('Error creating user');
    }
  };
  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">Sign Up</h1>
        <form onSubmit={handleSignup} className="signup-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <p className="login-link">
          Already have an account?{' '}
          <Link href="/login">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;