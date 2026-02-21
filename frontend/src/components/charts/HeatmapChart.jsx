import { useMemo } from 'react';

const HeatmapChart = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const data = useMemo(() => {
        return Array.from({ length: 52 }, () =>
            Array.from({ length: 7 }, () => Math.floor(Math.random() * 10))
        );
    }, []);

    const getColor = (value) => {
        if (value === 0) return 'var(--color-surface)';
        if (value <= 2) return 'rgba(99, 102, 241, 0.2)';
        if (value <= 4) return 'rgba(99, 102, 241, 0.4)';
        if (value <= 6) return 'rgba(99, 102, 241, 0.6)';
        if (value <= 8) return 'rgba(99, 102, 241, 0.8)';
        return 'rgba(99, 102, 241, 1)';
    };

    return (
        <div className="card">
            <h3 style={{ marginBottom: 8, fontFamily: 'var(--font-display)' }}>Activity Heatmap</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 20 }}>
                Daily activity intensity over the past year
            </p>
            <div style={{ overflowX: 'auto' }}>
                <div style={{ display: 'flex', gap: 2, minWidth: 700 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginRight: 8, paddingTop: 20 }}>
                        {days.map(d => (
                            <div key={d} style={{ height: 14, fontSize: '0.65rem', color: 'var(--color-text-muted)', lineHeight: '14px' }}>
                                {['Mon', 'Wed', 'Fri'].includes(d) ? d : ''}
                            </div>
                        ))}
                    </div>
                    {data.map((week, wi) => (
                        <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {wi % 4 === 0 && (
                                <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', height: 16, textAlign: 'center' }}>
                                    {months[Math.floor(wi / 4.33)] || ''}
                                </div>
                            )}
                            {wi % 4 !== 0 && <div style={{ height: 16 }} />}
                            {week.map((val, di) => (
                                <div key={di} style={{
                                    width: 14, height: 14, borderRadius: 3,
                                    background: getColor(val),
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer',
                                }} title={`${val} activities`} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Less</span>
                {[0, 2, 4, 6, 8, 10].map(v => (
                    <div key={v} style={{ width: 12, height: 12, borderRadius: 2, background: getColor(v) }} />
                ))}
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>More</span>
            </div>
        </div>
    );
};

export default HeatmapChart;
