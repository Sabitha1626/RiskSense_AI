import { useEffect, useRef } from 'react';
import { getRiskColor, getRiskLabel } from '../../utils/riskColorMapper';
import './RiskMeter.css';

const RiskMeter = ({ score = 0, size = 160, label = 'Risk Score' }) => {
    const canvasRef = useRef(null);
    const riskColor = getRiskColor(score);
    const riskLabel = getRiskLabel(score);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.scale(dpr, dpr);

        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size / 2 - 16;
        const startAngle = 0.75 * Math.PI;
        const endAngle = 2.25 * Math.PI;
        const scoreAngle = startAngle + (score / 100) * (endAngle - startAngle);

        // Background arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Score arc
        if (score > 0) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, scoreAngle);
            const gradient = ctx.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, riskColor);
            gradient.addColorStop(1, riskColor + 'aa');
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 10;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Glow effect
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, scoreAngle);
            ctx.strokeStyle = riskColor + '30';
            ctx.lineWidth = 20;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
    }, [score, size, riskColor]);

    return (
        <div className="risk-meter" style={{ width: size, height: size }}>
            <canvas
                ref={canvasRef}
                style={{ width: size, height: size }}
                className="risk-meter-canvas"
            />
            <div className="risk-meter-content">
                <span className="risk-meter-value" style={{ color: riskColor }}>
                    {score}%
                </span>
                <span className="risk-meter-label">{riskLabel}</span>
            </div>
        </div>
    );
};

export default RiskMeter;
