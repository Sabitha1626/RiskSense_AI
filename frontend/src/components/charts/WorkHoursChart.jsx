import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import projectService from '../../services/projectService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const WorkHoursChart = ({ employeeId = '2' }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await projectService.getWorkHoursData(employeeId);
            setChartData({
                labels: data.labels,
                datasets: [
                    {
                        label: 'Expected Hours',
                        data: data.expected,
                        borderColor: 'rgba(148, 163, 184, 0.5)',
                        backgroundColor: 'rgba(148, 163, 184, 0.05)',
                        borderDash: [5, 5],
                        fill: true,
                        tension: 0.3,
                        pointRadius: 0,
                    },
                    {
                        label: 'Actual Hours',
                        data: data.actual,
                        borderColor: '#06b6d4',
                        backgroundColor: (ctx) => {
                            const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 250);
                            gradient.addColorStop(0, 'rgba(6, 182, 212, 0.2)');
                            gradient.addColorStop(1, 'rgba(6, 182, 212, 0.01)');
                            return gradient;
                        },
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: '#06b6d4',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverRadius: 6,
                    },
                ],
            });
        };
        fetchData();
    }, [employeeId]);

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
                callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}h`,
                },
            },
        },
        scales: {
            x: {
                ticks: { color: '#64748b', font: { size: 11 } },
                grid: { color: 'rgba(255,255,255,0.04)' },
            },
            y: {
                ticks: { color: '#64748b', font: { size: 11 }, callback: (v) => v + 'h' },
                grid: { color: 'rgba(255,255,255,0.04)' },
                min: 0,
            },
        },
    };

    if (!chartData) return <div className="animate-pulse" style={{ height: 250 }} />;

    return <Line data={chartData} options={options} />;
};

export default WorkHoursChart;
