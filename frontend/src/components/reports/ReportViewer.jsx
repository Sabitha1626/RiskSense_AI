const ReportViewer = ({ report }) => {
    const defaultReport = report || {
        title: 'Sprint Progress Report',
        generated: '2026-02-20',
        sections: [
            {
                title: 'Executive Summary',
                content: 'The team maintained strong velocity this sprint with a 12% increase in task completion rate. Overall risk has decreased from 45% to 38%, primarily due to improved resource allocation and proactive blocker resolution.'
            },
            {
                title: 'Key Metrics',
                items: [
                    { label: 'Sprint Velocity', value: '42 story points' },
                    { label: 'Completion Rate', value: '87%' },
                    { label: 'Average Cycle Time', value: '3.2 days' },
                    { label: 'Bug Escape Rate', value: '4%' },
                ]
            },
            {
                title: 'Risk Assessment',
                content: 'Two projects remain in the medium-risk category. Project Alpha requires attention due to approaching deadline with incomplete critical path tasks.'
            },
        ]
    };

    return (
        <div className="report-viewer card" style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: 20, marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 4 }}>{defaultReport.title}</h2>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Generated: {defaultReport.generated}</span>
            </div>

            {defaultReport.sections.map((section, i) => (
                <div key={i} style={{ marginBottom: 24 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 12, color: 'var(--color-primary-light)' }}>
                        {section.title}
                    </h3>
                    {section.content && (
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                            {section.content}
                        </p>
                    )}
                    {section.items && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {section.items.map((item, j) => (
                                <div key={j} style={{
                                    padding: '12px 16px', background: 'var(--color-bg-glass)',
                                    borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)'
                                }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>{item.label}</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.value}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReportViewer;
