import { useState } from 'react';
import { HiOutlineChatAlt, HiOutlinePlus, HiOutlineReply } from 'react-icons/hi';

const DiscussionThreads = () => {
    const [threads, setThreads] = useState([
        {
            id: 1, title: 'Sprint 5 Planning Discussion', author: 'Alice Chen', time: '3 hours ago',
            replies: 8, lastReply: 'Bob: Agreed, let\'s focus on the API module first.',
            tags: ['planning', 'sprint-5'], pinned: true,
        },
        {
            id: 2, title: 'Risk Model Accuracy Improvements', author: 'Diana Ross', time: '1 day ago',
            replies: 5, lastReply: 'Diana: The new features improved accuracy by 12%.',
            tags: ['ai', 'risk'], pinned: false,
        },
        {
            id: 3, title: 'Database Migration Plan', author: 'Bob Williams', time: '2 days ago',
            replies: 12, lastReply: 'Charlie: Migration script is ready for review.',
            tags: ['backend', 'database'], pinned: false,
        },
        {
            id: 4, title: 'UI/UX Feedback Collection', author: 'Eve Johnson', time: '3 days ago',
            replies: 15, lastReply: 'Alice: Great suggestions, adding to backlog.',
            tags: ['frontend', 'design'], pinned: false,
        },
    ]);
    const [showNew, setShowNew] = useState(false);
    const [newThread, setNewThread] = useState({ title: '', content: '' });

    const tagColors = {
        planning: '#6366f1', 'sprint-5': '#06b6d4', ai: '#10b981', risk: '#ef4444',
        backend: '#f59e0b', database: '#8b5cf6', frontend: '#ec4899', design: '#14b8a6',
    };

    const handleCreate = () => {
        if (!newThread.title) return;
        setThreads(prev => [{
            id: Date.now(), title: newThread.title, author: 'You', time: 'Just now',
            replies: 0, lastReply: '', tags: [], pinned: false,
        }, ...prev]);
        setNewThread({ title: '', content: '' });
        setShowNew(false);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontFamily: 'var(--font-display)' }}>Discussion Threads</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setShowNew(true)}>
                    <HiOutlinePlus /> New Thread
                </button>
            </div>

            {showNew && (
                <div className="card" style={{ marginBottom: 16 }}>
                    <div className="form-group">
                        <input className="form-input" placeholder="Thread title..." value={newThread.title}
                            onChange={e => setNewThread(p => ({ ...p, title: e.target.value }))} />
                    </div>
                    <div className="form-group">
                        <textarea className="form-input" placeholder="Start the discussion..." rows={3}
                            value={newThread.content} onChange={e => setNewThread(p => ({ ...p, content: e.target.value }))} />
                    </div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => setShowNew(false)}>Cancel</button>
                        <button className="btn btn-primary btn-sm" onClick={handleCreate} disabled={!newThread.title}>Create</button>
                    </div>
                </div>
            )}

            {threads.map((thread, idx) => (
                <div key={thread.id} className="card thread-card animate-fadeIn" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                        <HiOutlineChatAlt style={{ fontSize: '1.3rem', color: 'var(--color-primary)', marginTop: 2, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                {thread.pinned && <span style={{ fontSize: '0.75rem' }}>📌</span>}
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{thread.title}</h4>
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                                {thread.tags.map(tag => (
                                    <span key={tag} style={{
                                        fontSize: '0.7rem', padding: '2px 8px', borderRadius: 'var(--radius-full)',
                                        background: (tagColors[tag] || '#666') + '20', color: tagColors[tag] || '#666',
                                        fontWeight: 600,
                                    }}>{tag}</span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                    {thread.author} • {thread.time}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                    <HiOutlineReply /> {thread.replies} replies
                                </span>
                            </div>
                            {thread.lastReply && (
                                <p style={{
                                    fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: 8,
                                    padding: '8px 12px', background: 'var(--color-bg-glass)', borderRadius: 'var(--radius-sm)',
                                    borderLeft: '2px solid var(--color-primary)'
                                }}>
                                    {thread.lastReply}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DiscussionThreads;
