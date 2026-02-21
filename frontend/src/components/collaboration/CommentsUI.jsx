import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { HiOutlinePaperAirplane } from 'react-icons/hi';

const avatarColors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const CommentsUI = ({ projectId }) => {
    const { user } = useContext(AuthContext);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([
        { id: 1, author: 'Alice Chen', text: 'The API integration is looking great! @Bob can you review the auth endpoints?', time: '2 hours ago', avatar: 'AC' },
        { id: 2, author: 'Bob Williams', text: '@Alice sure, I\'ll check it out this afternoon. The JWT flow looks solid.', time: '1 hour ago', avatar: 'BW' },
        { id: 3, author: 'Diana Ross', text: 'Updated the risk model — confidence scores are now more accurate. See the AI Insights page for details.', time: '30 min ago', avatar: 'DR' },
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setComments(prev => [...prev, {
            id: Date.now(),
            author: user?.name || 'You',
            text: newComment,
            time: 'Just now',
            avatar: (user?.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase(),
        }]);
        setNewComment('');
    };

    const renderText = (text) => {
        return text.split(/(@\w+)/g).map((part, i) =>
            part.startsWith('@') ? <span key={i} className="mention-tag">{part}</span> : part
        );
    };

    return (
        <div className="card">
            <h3 style={{ marginBottom: 16, fontFamily: 'var(--font-display)' }}>💬 Comments</h3>

            <div style={{ maxHeight: 400, overflowY: 'auto', marginBottom: 16 }}>
                {comments.map((c, idx) => (
                    <div key={c.id} className="collab-comment animate-fadeIn" style={{ animationDelay: `${idx * 0.05}s` }}>
                        <div className="collab-avatar" style={{ background: avatarColors[idx % avatarColors.length] + '30', color: avatarColors[idx % avatarColors.length] }}>
                            {c.avatar}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{c.author}</span>
                                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{c.time}</span>
                            </div>
                            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                                {renderText(c.text)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10 }}>
                <input className="form-input" placeholder="Write a comment... Use @name to mention"
                    value={newComment} onChange={e => setNewComment(e.target.value)} style={{ flex: 1 }} />
                <button type="submit" className="btn btn-primary" disabled={!newComment.trim()}>
                    <HiOutlinePaperAirplane />
                </button>
            </form>
        </div>
    );
};

export default CommentsUI;
