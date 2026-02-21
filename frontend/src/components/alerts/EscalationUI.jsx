import { HiOutlineExclamation, HiOutlineArrowUp } from 'react-icons/hi';

const EscalationUI = ({ alert, onEscalate, onResolve }) => {
    return (
        <div className="card escalation-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <HiOutlineExclamation style={{ color: 'var(--color-risk-high)', fontSize: '1.2rem' }} />
                        <h4 style={{ fontSize: '0.95rem' }}>Escalation Required</h4>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{alert?.message}</p>
                </div>
                <span className="badge badge-danger">Unresolved</span>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button className="btn btn-danger btn-sm" onClick={() => onEscalate?.(alert)}>
                    <HiOutlineArrowUp /> Escalate to Manager
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => onResolve?.(alert)}>
                    Mark Resolved
                </button>
            </div>

            {alert?.escalation_history && (
                <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Escalation History</span>
                    {alert.escalation_history.map((entry, i) => (
                        <div key={i} style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: 6 }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>{entry.date}</span> — {entry.action} by {entry.by}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EscalationUI;
