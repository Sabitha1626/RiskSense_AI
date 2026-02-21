import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlineArrowLeft } from 'react-icons/hi';
import '../pages/Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // API call placeholder — backend endpoint needed
            await new Promise(r => setTimeout(r, 1500));
            setSubmitted(true);
        } catch {
            setError('Failed to send reset email. Please try again.');
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
                    <p>Reset your password</p>
                </div>

                {submitted ? (
                    <div className="forgot-success animate-fadeIn">
                        <div className="success-icon">✉️</div>
                        <h3>Check your email</h3>
                        <p>We've sent a password reset link to <strong>{email}</strong></p>
                        <Link to="/login" className="btn btn-primary" style={{ width: '100%', marginTop: 20 }}>
                            <HiOutlineArrowLeft /> Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
                            Enter your email address and we'll send you a link to reset your password.
                        </p>

                        {error && <div className="auth-error">{error}</div>}

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="input-icon-wrapper">
                                <HiOutlineMail className="input-icon" />
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ width: '100%', padding: '12px' }}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <div className="auth-footer">
                            <Link to="/login"><HiOutlineArrowLeft style={{ verticalAlign: 'middle' }} /> Back to Login</Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
