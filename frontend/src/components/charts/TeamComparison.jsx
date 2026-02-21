import { Bar, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const TeamComparison = () => {
    const members = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
    const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

    const barData = {
        labels: members,
        datasets: [
            {
                label: 'Tasks Completed',
                data: [28, 22, 18, 32, 25],
                backgroundColor: colors.map(c => c + '80'),
                borderColor: colors,
                borderWidth: 1.5,
                borderRadius: 6,
            },
        ],
    };

    const radarData = {
        labels: ['Speed', 'Quality', 'Collaboration', 'Consistency', 'Innovation'],
        datasets: members.slice(0, 3).map((name, i) => ({
            label: name,
            data: Array.from({ length: 5 }, () => Math.floor(Math.random() * 40) + 60),
            borderColor: colors[i],
            backgroundColor: colors[i] + '15',
            pointBackgroundColor: colors[i],
            borderWidth: 2,
        })),
    };

    const barOptions = {
        responsive: true,
        plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Inter' } } } },
        scales: {
            x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
            y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
        },
    };

    const radarOptions = {
        responsive: true,
        plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Inter' } } } },
        scales: {
            r: {
                angleLines: { color: 'rgba(255,255,255,0.06)' },
                grid: { color: 'rgba(255,255,255,0.06)' },
                pointLabels: { color: '#94a3b8', font: { size: 12 } },
                ticks: { color: '#64748b', backdropColor: 'transparent' },
            },
        },
    };

    return (
        <div>
            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Tasks Completed by Team Member</h3>
                    <Bar data={barData} options={barOptions} />
                </div>
                <div className="chart-card">
                    <h3>Performance Radar</h3>
                    <Radar data={radarData} options={radarOptions} />
                </div>
            </div>

            {/* Leaderboard */}
            <div className="card" style={{ marginTop: 20 }}>
                <h3 style={{ marginBottom: 16, fontFamily: 'var(--font-display)' }}>🏆 Team Leaderboard</h3>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Rank</th><th>Member</th><th>Tasks Done</th><th>Avg Quality</th><th>Streak</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: 'Diana', tasks: 32, quality: 95, streak: '7 days' },
                                { name: 'Alice', tasks: 28, quality: 92, streak: '5 days' },
                                { name: 'Eve', tasks: 25, quality: 88, streak: '3 days' },
                                { name: 'Bob', tasks: 22, quality: 90, streak: '4 days' },
                                { name: 'Charlie', tasks: 18, quality: 85, streak: '2 days' },
                            ].map((m, i) => (
                                <tr key={m.name}>
                                    <td style={{ fontWeight: 700, color: i < 3 ? colors[i] : 'inherit' }}>
                                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{m.name}</td>
                                    <td>{m.tasks}</td>
                                    <td>
                                        <span className={`badge ${m.quality >= 90 ? 'badge-success' : 'badge-warning'}`}>
                                            {m.quality}%
                                        </span>
                                    </td>
                                    <td>🔥 {m.streak}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeamComparison;
