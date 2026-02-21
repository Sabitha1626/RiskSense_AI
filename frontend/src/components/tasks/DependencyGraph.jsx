const DependencyGraph = ({ tasks = [] }) => {
    const demoTasks = tasks.length ? tasks : [
        { id: '1', title: 'Setup Project', dependencies: [] },
        { id: '2', title: 'Design Database', dependencies: ['1'] },
        { id: '3', title: 'Build API', dependencies: ['2'] },
        { id: '4', title: 'Build Frontend', dependencies: ['2'] },
        { id: '5', title: 'Integration Tests', dependencies: ['3', '4'] },
        { id: '6', title: 'Deploy', dependencies: ['5'] },
    ];

    const nodeWidth = 160;
    const nodeHeight = 44;
    const levelGap = 100;
    const nodeGap = 30;

    // Assign levels using topological ordering
    const levels = {};
    const assignLevel = (id, visited = new Set()) => {
        if (levels[id] !== undefined) return levels[id];
        if (visited.has(id)) return 0;
        visited.add(id);
        const task = demoTasks.find(t => t.id === id);
        if (!task || !task.dependencies?.length) { levels[id] = 0; return 0; }
        const maxDep = Math.max(...task.dependencies.map(d => assignLevel(d, visited)));
        levels[id] = maxDep + 1;
        return levels[id];
    };
    demoTasks.forEach(t => assignLevel(t.id));

    const maxLevel = Math.max(...Object.values(levels), 0);
    const levelGroups = {};
    demoTasks.forEach(t => {
        const l = levels[t.id] || 0;
        if (!levelGroups[l]) levelGroups[l] = [];
        levelGroups[l].push(t);
    });

    const positions = {};
    for (let l = 0; l <= maxLevel; l++) {
        const group = levelGroups[l] || [];
        const totalHeight = group.length * nodeHeight + (group.length - 1) * nodeGap;
        const startY = (300 - totalHeight) / 2;
        group.forEach((t, i) => {
            positions[t.id] = {
                x: 40 + l * (nodeWidth + levelGap),
                y: Math.max(20, startY + i * (nodeHeight + nodeGap)),
            };
        });
    }

    const svgWidth = 80 + (maxLevel + 1) * (nodeWidth + levelGap);
    const svgHeight = Math.max(300, ...Object.values(positions).map(p => p.y + nodeHeight + 40));

    const colors = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-risk-low)', 'var(--color-risk-medium)'];

    return (
        <div className="dependency-graph">
            <div className="section-header">
                <h2>Task Dependencies</h2>
            </div>
            <div className="card" style={{ overflow: 'auto' }}>
                <svg width={svgWidth} height={svgHeight} style={{ display: 'block' }}>
                    <defs>
                        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                            <polygon points="0 0, 8 3, 0 6" fill="var(--color-text-muted)" />
                        </marker>
                    </defs>

                    {/* Lines */}
                    {demoTasks.map(task =>
                        (task.dependencies || []).map(depId => {
                            const from = positions[depId];
                            const to = positions[task.id];
                            if (!from || !to) return null;
                            return (
                                <line key={`${depId}-${task.id}`}
                                    x1={from.x + nodeWidth} y1={from.y + nodeHeight / 2}
                                    x2={to.x} y2={to.y + nodeHeight / 2}
                                    stroke="var(--color-text-muted)" strokeWidth={1.5}
                                    strokeDasharray="6,4" markerEnd="url(#arrowhead)" opacity={0.5} />
                            );
                        })
                    )}

                    {/* Nodes */}
                    {demoTasks.map((task, idx) => {
                        const pos = positions[task.id];
                        if (!pos) return null;
                        const color = colors[idx % colors.length];
                        return (
                            <g key={task.id}>
                                <rect x={pos.x} y={pos.y} width={nodeWidth} height={nodeHeight}
                                    rx={8} fill="var(--color-bg-secondary)"
                                    stroke={color} strokeWidth={1.5} />
                                <rect x={pos.x} y={pos.y} width={4} height={nodeHeight}
                                    rx={2} fill={color} />
                                <text x={pos.x + 14} y={pos.y + nodeHeight / 2 + 4}
                                    fill="var(--color-text)" fontSize="12" fontWeight="500"
                                    fontFamily="var(--font-primary)">
                                    {task.title.length > 18 ? task.title.slice(0, 18) + '…' : task.title}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default DependencyGraph;
