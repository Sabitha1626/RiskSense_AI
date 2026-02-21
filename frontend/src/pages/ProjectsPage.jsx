import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import ProjectCard from '../components/dashboard/ProjectCard';
import useProjects from '../hooks/useProjects';
import Loader from '../components/common/Loader';

const ProjectsPage = () => {
    const { projects, loading, error } = useProjects();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="app-layout">
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sidebarCollapsed={sidebarCollapsed} />
                <div className="page-container animate-fadeIn">
                    <div className="page-header">
                        <h1>All Projects</h1>
                        <p>Browse all projects and their risk assessments</p>
                    </div>

                    {loading ? (
                        <Loader text="Loading projects..." />
                    ) : error ? (
                        <div className="error-state">
                            <p>⚠️ Failed to load projects. Please try again.</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📁</div>
                            <p>No projects found.<br />Your manager will add projects and assign you to them.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
                            {projects.map((project) => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectsPage;
