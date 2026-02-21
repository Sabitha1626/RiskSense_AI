import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const ForecastChart = () => {
    const actualData = [65, 68, 70, 72, 75, 78, 80, 82, null, null, null, null];
    const forecastData = [null, null, null, null, null, null, null, 82, 85, 88, 91, 94];
    const pessimistic = [null, null, null, null, null, null, null, 82, 83, 84, 85, 86];
    const optimistic = [null, null, null, null, null, null, null, 82, 87, 92, 96, 100];

    const data = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12'],
        datasets: [
            {
                label: 'Actual Progress',
                data: actualData,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#6366f1',
                borderWidth: 2.5,
            },
            {
                label: 'Forecast (Expected)',
                data: forecastData,
                borderColor: '#06b6d4',
                borderDash: [6, 4],
                fill: false,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#06b6d4',
                borderWidth: 2,
            },
            {
                label: 'Optimistic',
                data: optimistic,
                borderColor: 'rgba(16, 185, 129, 0.5)',
                backgroundColor: 'rgba(16, 185, 129, 0.05)',
                borderDash: [4, 4],
                fill: '+1',
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 1,
            },
            {
                label: 'Pessimistic',
                data: pessimistic,
                borderColor: 'rgba(239, 68, 68, 0.5)',
                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                borderDash: [4, 4],
                fill: false,
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 }, usePointStyle: true, pointStyle: 'line' },
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
            },
        },
        scales: {
            x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
            y: {
                ticks: { color: '#64748b', callback: v => v + '%' },
                grid: { color: 'rgba(255,255,255,0.04)' },
                min: 60, max: 105,
            },
        },
    };

    return (
        <div className="card">
            <h3 style={{ marginBottom: 8, fontFamily: 'var(--font-display)' }}>Project Completion Forecast</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 20 }}>
                AI-projected completion with optimistic/pessimistic scenarios
            </p>
            <Line data={data} options={options} />
            <div style={{ display: 'flex', gap: 20, marginTop: 16, justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#06b6d4' }}>Week 11</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Expected Completion</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-risk-low)' }}>87%</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>On-time Probability</div>
                </div>
            </div>
        </div>
    );
};

export default ForecastChart;
