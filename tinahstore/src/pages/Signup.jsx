import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext.jsx';
import Icon from '../components/icons/Icon.jsx';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post(`${API_URL}/auth/registration/`, {
        email,
        password1: password,
        password2: confirmPassword,
      });

      navigate('/account'); // or '/login' if that's your flow
    } catch (err) {
      setError(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : 'Registration failed. Please try again.'
      );
    }
  };
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await googleLogin(tokenResponse.access_token);
        navigate('/');
      } catch (err) {
        setError('Google login failed');
      }
    },
  });

  return (
    <>
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link><span className="sep">/</span><span className="current">Create Account</span>
        </nav>
        <div className="page-head">
          <div>
            <p className="eyebrow">Join TinahStore</p>
            <h2 className="h2">Create your account</h2>
            <span className="muted" style={{ fontSize: 13.5 }}>Join our community of leather craft lovers.</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 90 }}>
        <div className="account-layout">
          <form className="account-card" onSubmit={handleSignup}>
            <h3>Get started</h3>
            {error && <p className="error-text" style={{ color: 'var(--oxblood)', fontSize: 14, marginBottom: 15 }}>{error}</p>}
            <div className="form-field">
              <label>Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required />
            </div>
            <div className="form-field">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required />
            </div>
            <div className="form-field">
              <label>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" required />
            </div>
            <button className="btn btn-primary btn-block" type="submit">Create account</button>

            <div className="divider" style={{ margin: '24px 0', textAlign: 'center', position: 'relative' }}>
              <span style={{ background: 'var(--surface)', padding: '0 12px', fontSize: 12, color: 'var(--muted)', position: 'relative', zIndex: 1 }}>OR</span>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--hairline)' }}></div>
            </div>

            <button type="button" onClick={() => handleGoogleLogin()} className="btn btn-outline btn-block" style={{ gap: 12 }}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18" />
              Sign up with Google
            </button>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <p className="muted" style={{ fontSize: 14 }}>Already have an account?</p>
              <Link to="/account" className="account-link" style={{ marginTop: 4 }}>Sign in here</Link>
            </div>
          </form>

          <div className="account-card account-benefits">
            <h3>Why create an account?</h3>
            {[
              ['truck', 'Faster shipping', 'We store your preferred delivery address.'],
              ['creditCard', 'Order history', 'Access your digital receipts anytime.'],
              ['star', 'Exclusive drops', 'Get notified about limited leather batches.'],
            ].map(([icon, title, copy]) => (
              <div className="account-benefit" key={title}>
                <span className="contact-icon"><Icon name={icon} /></span>
                <div><strong>{title}</strong><span>{copy}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
