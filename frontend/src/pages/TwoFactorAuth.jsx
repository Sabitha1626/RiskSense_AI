import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineShieldCheck } from 'react-icons/hi';
import '../pages/Auth.css';

const TwoFactorAuth = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        pasted.split('').forEach((ch, i) => { newOtp[i] = ch; });
        setOtp(newOtp);
        inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) { setError('Please enter the full 6-digit code'); return; }
        setLoading(true);
        setError('');
        try {
            await new Promise(r => setTimeout(r, 1500));
            navigate('/');
        } catch {
            setError('Invalid verification code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = () => {
        setResendCooldown(30);
        // API call placeholder
    };

    return (
        <div className="auth-page">
            <div className="auth-bg-orbs">
                <div className="orb" /><div className="orb" /><div className="orb" />
            </div>
            <div className="auth-card">
                <div className="auth-logo">
                    <h1>◈ RiskSense AI</h1>
                    <p>Two-Factor Authentication</p>
                </div>

                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: '50%',
                        background: 'rgba(99,102,241,0.15)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px', fontSize: '1.8rem', color: 'var(--color-primary-light)'
                    }}>
                        <HiOutlineShieldCheck />
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                        Enter the 6-digit code from your authenticator app
                    </p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="otp-inputs" onPaste={handlePaste}>
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={el => inputRefs.current[i] = el}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                className="otp-input"
                                value={digit}
                                onChange={e => handleChange(i, e.target.value)}
                                onKeyDown={e => handleKeyDown(i, e)}
                            />
                        ))}
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}
                        style={{ width: '100%', padding: '12px', marginTop: 24 }}>
                        {loading ? 'Verifying...' : 'Verify Code'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <button type="button" className="btn btn-ghost" onClick={handleResend}
                            disabled={resendCooldown > 0}>
                            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TwoFactorAuth;
