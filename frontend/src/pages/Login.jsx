import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './Auth.css';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('employee');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const successMsg = searchParams.get('registered');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(email, password, role);
            navigate(user.role === 'manager' ? '/manager' : '/employee');
        } catch (err) {
            if (!err.response) {
                setError('Cannot connect to server. Please make sure the backend is running.');
            } else {
                const serverMsg = err.response?.data?.message || err.response?.data?.error;
                setError(serverMsg || 'Invalid email or password');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-bg-orbs">
                <div className="orb" />
                <div className="orb" />
                <div className="orb" />
            </div>

            <div className="auth-card">
                <div className="auth-logo">
                    <h1>◈ RiskSense AI</h1>
                    <p>Predict. Detect. Prevent.</p>
                </div>

                {successMsg && (
                    <div className="auth-success animate-fadeIn">
                        Registration successful! Please log in.
                    </div>
                )}

                {error && <div className="auth-error animate-fadeIn">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Role</label>
                        <select
                            className="form-input"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="manager">Manager</option>
                            <option value="employee">Employee</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-demo-creds">
                    <p>Demo Credentials:</p>
                    <div className="cred-pills">
                        <button className="cred-pill" onClick={() => { setEmail('ravi@company.com'); setPassword('password123'); setRole('manager'); }}>
                            👔 Manager
                        </button>
                        <button className="cred-pill" onClick={() => { setEmail('priya@company.com'); setPassword('password123'); setRole('employee'); }}>
                            👩‍💻 Employee
                        </button>
                    </div>
                </div>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Register here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
