import { useState } from 'react';
import { HiOutlinePlay } from 'react-icons/hi';

const SimulationControls = ({ onSimulate }) => {
    const [teamSize, setTeamSize] = useState(5);
    const [scopeChange, setScopeChange] = useState(0);
    const [deadlineShift, setDeadlineShift] = useState(0);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const runSimulation = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1200));
        const newRisk = Math.max(0.05, Math.min(0.95,
            0.40 - (teamSize - 5) * 0.04 + scopeChange * 0.03 - deadlineShift * 0.02
        ));
        const res = {
            riskScore: newRisk,
            completionProbability: 1 - newRisk + 0.05,
            estimatedDelivery: `${deadlineShift >= 0 ? '+' : ''}${deadlineShift} days from current deadline`,
            teamEfficiency: Math.min(100, 75 + teamSize * 2 - scopeChange * 3),
        };
        setResult(res);
        onSimulate?.(res);
        setLoading(false);
    };

    const riskColor = (r) => r < 0.3 ? 'var(--color-risk-low)' : r < 0.6 ? 'var(--color-risk-medium)' : 'var(--color-risk-high)';

    return (
        <div className="card">
            <h3 style={{ marginBottom: 20, fontFamily: 'var(--font-display)' }}>🎛️ What-If Simulation</h3>

            <div className="sim-slider">
                <label>
                    <span>Team Size</span>
                    <span style={{ fontWeight: 700, color: 'var(--color-primary-light)' }}>{teamSize} members</span>
                </label>
                <input type="range" min={1} max={15} value={teamSize} onChange={e => setTeamSize(+e.target.value)} />
            </div>

            <div className="sim-slider">
                <label>
                    <span>Scope Change</span>
                    <span style={{ fontWeight: 700, color: scopeChange > 0 ? 'var(--color-risk-high)' : 'var(--color-risk-low)' }}>
                        {scopeChange > 0 ? '+' : ''}{scopeChange * 10}%
                    </span>
                </label>
                <input type="range" min={-5} max={5} value={scopeChange} onChange={e => setScopeChange(+e.target.value)} />
            </div>

            <div className="sim-slider">
                <label>
                    <span>Deadline Adjustment</span>
                    <span style={{ fontWeight: 700, color: deadlineShift >= 0 ? 'var(--color-risk-low)' : 'var(--color-risk-high)' }}>
                        {deadlineShift > 0 ? '+' : ''}{deadlineShift} days
                    </span>
                </label>
                <input type="range" min={-14} max={14} value={deadlineShift} onChange={e => setDeadlineShift(+e.target.value)} />
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={runSimulation} disabled={loading}>
                {loading ? '⏳ Simulating...' : <><HiOutlinePlay /> Run Simulation</>}
            </button>

            {result && (
                <div className="sim-result animate-fadeIn">
                    <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: riskColor(result.riskScore) }}>
                        {(result.riskScore * 100).toFixed(0)}%
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>Projected Risk</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, textAlign: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 700, color: 'var(--color-risk-low)' }}>{(result.completionProbability * 100).toFixed(0)}%</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>On-time Chance</div>
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{result.teamEfficiency}%</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Team Efficiency</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimulationControls;
