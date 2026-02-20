import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin, refreshAdminUser } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@sellora.com');
  const [password, setPassword] = useState('Sellora123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await adminLogin(email, password);
      const user = await refreshAdminUser();
      if (user?.role !== 'admin') {
        setError('This account does not have admin access.');
        return;
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="kicker" style={{ color: '#8d5f35', letterSpacing: '0.35em', fontSize: '0.75rem', textTransform: 'uppercase' }}>
          Sellora Admin
        </div>
        <h2 className="login-title">Welcome back</h2>
        <p className="login-subtitle">Use your admin credentials to continue.</p>
        {error && <div style={{ color: '#c0392b', marginBottom: 12 }}>{error}</div>}
        <form onSubmit={onSubmit} className="form-grid">
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <div className="login-actions">
            <button className="button" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <button className="button secondary" type="button" onClick={() => { setEmail('admin@sellora.com'); setPassword('Sellora123'); }}>
              Use default admin
            </button>
          </div>
        </form>
        <div className="login-hint">Default admin: admin@sellora.com / Sellora123</div>
      </div>
    </div>
  );
}
