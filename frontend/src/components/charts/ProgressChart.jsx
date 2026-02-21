import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import projectService from '../../services/projectService';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProgressChart = ({ projectId }) => {
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!projectId) return;
        const fetchData = async () => {
            try {
                const data = await projectService.getProgressHistory(projectId);
                setChartData({
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'Planned Progress %',
                            data: data.planned,
                            backgroundColor: 'rgba(99, 102, 241, 0.7)',
                            borderColor: 'rgba(99, 102, 241, 1)',
                            borderWidth: 1,
                            borderRadius: 4,
                        },
                        {
                            label: 'Actual Progress %',
                            data: data.actual,
                            backgroundColor: 'rgba(6, 182, 212, 0.7)',
                            borderColor: 'rgba(6, 182, 212, 1)',
                            borderWidth: 1,
                            borderRadius: 4,
                        },
                    ],
                });
            } catch (err) {
                setError('Failed to load progress data');
            }
        };
        fetchData();
    }, [projectId]);

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#94a3b8', font: { size: 12, family: 'Inter' }, boxWidth: 12, padding: 16 },
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                titleColor: '#f1f5f9',
                bodyColor: '#94a3b8',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
            },
        },
        scales: {
            x: {
                ticks: { color: '#64748b', font: { size: 11 } },
                grid: { color: 'rgba(255,255,255,0.04)' },
            },
            y: {
                ticks: { color: '#64748b', font: { size: 11 }, callback: (v) => v + '%' },
                grid: { color: 'rgba(255,255,255,0.04)' },
                max: 100,
            },
        },
    };

    if (!projectId) return <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>Select a project to view progress</div>;
    if (error) return <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-risk-high)' }}>{error}</div>;
    if (!chartData) return <div className="animate-pulse" style={{ height: 250 }} />;

    return <Bar data={chartData} options={options} />;
};

export default ProgressChart;
