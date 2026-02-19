import { useNavigate } from 'react-router-dom';
import { getRiskColor, getRiskLabel, getRiskBadgeClass } from '../../utils/riskColorMapper';
import { formatDate, getDaysRemaining, isOverdue } from '../../utils/dateUtils';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
    const navigate = useNavigate();
    const daysLeft = getDaysRemaining(project.deadline);
    const overdue = isOverdue(project.deadline);
    const riskColor = getRiskColor(project.riskScore);
    const riskLabel = getRiskLabel(project.riskScore);
    const badgeClass = getRiskBadgeClass(project.riskScore);

    const getProgressClass = () => {
        if (project.riskScore <= 25) return 'low';
        if (project.riskScore <= 50) return 'medium';
        return 'high';
    };

    return (
        <div className="project-card card" onClick={() => navigate(`/projects/${project._id}`)}>
            <div className="project-card-header">
                <h3 className="project-card-name">{project.name}</h3>
                <span className={`badge ${badgeClass}`}>{riskLabel} Risk</span>
            </div>

            <p className="project-card-desc">{project.description}</p>

            <div className="project-card-progress">
                <div className="progress-header">
                    <span>Progress</span>
                    <span className="progress-value">{project.progress}%</span>
                </div>
                <div className="progress-bar">
                    <div
                        className={`progress-fill ${getProgressClass()}`}
                        style={{ width: `${project.progress}%` }}
                    />
                </div>
            </div>

            <div className="project-card-meta">
                <div className="meta-item">
                    <span className="meta-label">Deadline</span>
                    <span className={`meta-value ${overdue ? 'overdue' : ''}`}>
                        {formatDate(project.deadline)}
                    </span>
                </div>
                <div className="meta-item">
                    <span className="meta-label">Time Left</span>
                    <span className={`meta-value ${overdue ? 'overdue' : daysLeft <= 7 ? 'urgent' : ''}`}>
                        {overdue ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d remaining`}
                    </span>
                </div>
                <div className="meta-item">
                    <span className="meta-label">Team</span>
                    <span className="meta-value">{project.teamMembers?.length || 0} members</span>
                </div>
            </div>

            <div className="project-card-risk-bar" style={{ backgroundColor: riskColor + '20' }}>
                <div
                    className="project-card-risk-fill"
                    style={{ width: `${project.riskScore}%`, backgroundColor: riskColor }}
                />
            </div>
        </div>
    );
};

export default ProjectCard;
