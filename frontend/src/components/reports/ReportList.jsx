import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import reportService from '../../services/reportService';
import FraudFlagBadge from './FraudFlagBadge';
import Loader from '../common/Loader';
import { formatDate } from '../../utils/dateUtils';
import './ReportList.css';

const ReportList = ({ projectId, employeeId, showFraudOnly = false }) => {
    const { user } = useContext(AuthContext);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(showFraudOnly ? 'fraud' : 'all');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const filters = {};
                if (projectId) filters.projectId = projectId;
                if (employeeId) filters.employeeId = employeeId;
                if (filter === 'fraud') filters.fraudOnly = true;
                const data = await reportService.getReports(filters);
                setReports(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [projectId, employeeId, filter]);

    if (loading) return <Loader text="Loading reports..." />;

    return (
        <div className="report-list">
            <div className="report-list-header">
                <h3>📋 Work Reports</h3>
                <div className="report-filters">
                    <button
                        className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`btn btn-sm ${filter === 'fraud' ? 'btn-danger' : 'btn-ghost'}`}
                        onClick={() => setFilter('fraud')}
                    >
                        ⚠ Flagged ({reports.filter((r) => r.fraudFlag).length})
                    </button>
                </div>
            </div>

            {reports.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <p>No reports found</p>
                </div>
            ) : (
                <div className="report-items">
                    {reports.map((report) => (
                        <div key={report._id} className={`report-item card ${report.fraudFlag ? 'flagged' : ''}`}>
                            <div className="report-item-header">
                                <div className="report-meta">
                                    <span className="report-employee">{report.employeeName}</span>
                                    <span className="report-date">{formatDate(report.date)}</span>
                                </div>
                                <div className="report-stats">
                                    <span className="stat">
                                        <span className="stat-label">Hours</span>
                                        <span className="stat-value">{report.hoursWorked}h</span>
                                    </span>
                                    <span className="stat">
                                        <span className="stat-label">Progress</span>
                                        <span className="stat-value">{report.progressPercent}%</span>
                                    </span>
                                </div>
                            </div>
                            <p className="report-description">{report.description}</p>
                            {report.fraudFlag && (
                                <FraudFlagBadge score={report.fraudScore} reason={report.fraudReason} />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReportList;
