import { useState, useEffect } from 'react';
import projectService from '../services/projectService';

const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const data = await projectService.getProjects();
                setProjects(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const getProjectById = (id) => projects.find((p) => p._id === id);

    const atRiskProjects = projects.filter((p) => p.riskScore > 50);
    const overdueProjects = projects.filter((p) => {
        const deadline = new Date(p.deadline);
        return deadline < new Date() && p.progress < 100;
    });
    const avgProductivity = projects.length
        ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
        : 0;

    return {
        projects,
        loading,
        error,
        getProjectById,
        atRiskProjects,
        overdueProjects,
        avgProductivity,
        totalProjects: projects.length,
    };
};

export default useProjects;
