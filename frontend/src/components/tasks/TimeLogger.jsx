import { useState, useEffect, useRef } from 'react';
import { HiOutlineClock, HiOutlinePlay, HiOutlinePause, HiOutlineStop } from 'react-icons/hi';

const TimeLogger = ({ taskId, onLogTime }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [manualHours, setManualHours] = useState('');
    const [manualMinutes, setManualMinutes] = useState('');
    const [logs, setLogs] = useState([
        { id: 1, hours: 2, minutes: 30, date: '2026-02-19', note: 'API development' },
        { id: 2, hours: 1, minutes: 15, date: '2026-02-20', note: 'Bug fixing' },
    ]);
    const [note, setNote] = useState('');
    const intervalRef = useRef(null);

    useEffect(() => {
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, []);

    const startTimer = () => {
        setIsRunning(true);
        intervalRef.current = setInterval(() => setElapsed(p => p + 1), 1000);
    };

    const pauseTimer = () => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
    };

    const stopTimer = () => {
        pauseTimer();
        if (elapsed > 0) {
            const hours = Math.floor(elapsed / 3600);
            const minutes = Math.floor((elapsed % 3600) / 60);
            addLog(hours, minutes);
        }
        setElapsed(0);
    };

    const addLog = (hours, minutes) => {
        const log = {
            id: Date.now(),
            hours: parseInt(hours) || 0,
            minutes: parseInt(minutes) || 0,
            date: new Date().toISOString().split('T')[0],
            note: note || 'Work session',
        };
        setLogs(p => [log, ...p]);
        setNote('');
        onLogTime?.(log);
    };

    const handleManualLog = () => {
        if (!manualHours && !manualMinutes) return;
        addLog(manualHours, manualMinutes);
        setManualHours('');
        setManualMinutes('');
    };

    const formatTime = (s) => {
        const h = Math.floor(s / 3600).toString().padStart(2, '0');
        const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
        const sec = (s % 60).toString().padStart(2, '0');
        return `${h}:${m}:${sec}`;
    };

    const totalLogged = logs.reduce((sum, l) => sum + l.hours * 60 + l.minutes, 0);

    return (
        <div className="time-logger">
            <div className="section-header">
                <h2><HiOutlineClock style={{ verticalAlign: 'middle' }} /> Time Tracker</h2>
            </div>

            {/* Timer */}
            <div className="card" style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800,
                    background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent', marginBottom: 16
                }}>
                    {formatTime(elapsed)}
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 16 }}>
                    {!isRunning ? (
                        <button className="btn btn-primary" onClick={startTimer}>
                            <HiOutlinePlay /> Start
                        </button>
                    ) : (
                        <button className="btn btn-secondary" onClick={pauseTimer}>
                            <HiOutlinePause /> Pause
                        </button>
                    )}
                    <button className="btn btn-danger" onClick={stopTimer} disabled={elapsed === 0}>
                        <HiOutlineStop /> Stop & Log
                    </button>
                </div>
                <input className="form-input" placeholder="What are you working on?" value={note}
                    onChange={e => setNote(e.target.value)}
                    style={{ maxWidth: 300, margin: '0 auto', textAlign: 'center' }} />
            </div>

            {/* Manual entry */}
            <div className="card" style={{ marginBottom: 20 }}>
                <h4 style={{ marginBottom: 12, fontSize: '0.9rem' }}>Manual Time Entry</h4>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                    <div>
                        <label className="form-label">Hours</label>
                        <input type="number" className="form-input" min={0} style={{ width: 80 }}
                            value={manualHours} onChange={e => setManualHours(e.target.value)} />
                    </div>
                    <div>
                        <label className="form-label">Minutes</label>
                        <input type="number" className="form-input" min={0} max={59} style={{ width: 80 }}
                            value={manualMinutes} onChange={e => setManualMinutes(e.target.value)} />
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={handleManualLog}>Log Time</button>
                </div>
            </div>

            {/* Logs */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                    <h4 style={{ fontSize: '0.9rem' }}>Time Logs</h4>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                        Total: {Math.floor(totalLogged / 60)}h {totalLogged % 60}m
                    </span>
                </div>
                {logs.map(log => (
                    <div key={log.id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '10px 0', borderBottom: '1px solid var(--border-color)'
                    }}>
                        <div>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{log.hours}h {log.minutes}m</span>
                            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginLeft: 12 }}>{log.note}</span>
                        </div>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{log.date}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimeLogger;
