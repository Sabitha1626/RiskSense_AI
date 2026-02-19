import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import projectService from '../../services/projectService';

ChartJS.register(ArcElement, Tooltip, Legend);

const DeadlineRiskChart = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const dist = await projectService.getRiskDistribution();
            setChartData({
                labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical'],
                datasets: [
                    {
                        data: [dist.low, dist.medium, dist.high, dist.critical],
                        backgroundColor: [
                            'rgba(16, 185, 129, 0.85)',
                            'rgba(245, 158, 11, 0.85)',
                            'rgba(239, 68, 68, 0.85)',
                            'rgba(220, 38, 38, 0.95)',
                        ],
                        borderColor: [
                            'rgba(16, 185, 129, 1)',
                            'rgba(245, 158, 11, 1)',
                            'rgba(239, 68, 68, 1)',
                            'rgba(220, 38, 38, 1)',
                        ],
                        borderWidth: 2,
                        hoverOffset: 8,
                    },
                ],
            });
        };
        fetchData();
    }, []);

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '65%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#94a3b8',
                    font: { size: 12, family: 'Inter' },
                    padding: 16,
                    usePointStyle: true,
                    pointStyleWidth: 10,
                },
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
                    label: (ctx) => ` ${ctx.label}: ${ctx.parsed} project(s)`,
                },
            },
        },
    };

    if (!chartData) return <div className="animate-pulse" style={{ height: 250 }} />;

    return <Doughnut data={chartData} options={options} />;
};

export default DeadlineRiskChart;
