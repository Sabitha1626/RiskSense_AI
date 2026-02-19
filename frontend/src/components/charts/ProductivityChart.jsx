import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import projectService from '../../services/projectService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ProductivityChart = ({ employeeId = '2' }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await projectService.getProductivityData(employeeId);
            setChartData({
                labels: data.labels,
                datasets: [
                    {
                        label: 'Productivity Score',
                        data: data.data,
                        borderColor: '#6366f1',
                        backgroundColor: (ctx) => {
                            const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 250);
                            gradient.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
                            gradient.addColorStop(1, 'rgba(99, 102, 241, 0.01)');
                            return gradient;
                        },
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointBackgroundColor: '#6366f1',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverRadius: 7,
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
                display: false,
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
                    label: (ctx) => `Productivity: ${ctx.parsed.y}%`,
                },
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
                min: 0,
                max: 100,
            },
        },
    };

    if (!chartData) return <div className="animate-pulse" style={{ height: 250 }} />;

    return <Line data={chartData} options={options} />;
};

export default ProductivityChart;
