import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import { ThemeProvider } from './context/ThemeContext';
import { useContext } from 'react';
import Loader from './components/common/Loader';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import TwoFactorAuth from './pages/TwoFactorAuth';

// Dashboard Pages
import ManagerHome from './pages/ManagerHome';
import EmployeeHome from './pages/EmployeeHome';

// Project & Task Pages
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetail from './pages/ProjectDetail';
import CreateProject from './pages/CreateProject';
import TaskDetail from './pages/TaskDetail';
import TaskAssignment from './pages/TaskAssignment';
import KanbanBoard from './pages/KanbanBoard';
import DailyProgressUpdate from './pages/DailyProgressUpdate';

// AI & Risk Pages
import RiskPrediction from './pages/RiskPrediction';
import AIInsightsPage from './pages/AIInsightsPage';
import EmployeePerformance from './pages/EmployeePerformance';

// Reports & Analytics
import ReportsPage from './pages/ReportsPage';
import WeeklySummaryPage from './pages/WeeklySummaryPage';
import AnalyticsPage from './pages/AnalyticsPage';

// Alerts & Notifications
import AlertsPage from './pages/AlertsPage';
import AlertCenterPage from './pages/AlertCenterPage';

// Collaboration & Planning
import CollaborationPage from './pages/CollaborationPage';
import SmartPlanningPage from './pages/SmartPlanningPage';

// Integration & Settings
import JiraIntegrationPage from './pages/JiraIntegrationPage';
import SettingsPage from './pages/SettingsPage';

const useAuth = () => useContext(AuthContext);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loader text="Authenticating..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const ManagerRoute = ({ children }) => {
  const { isManager, loading } = useAuth();
  if (loading) return <Loader text="Authenticating..." />;
  if (!isManager) return <Navigate to="/" replace />;
  return children;
};

const EmployeeRoute = ({ children }) => {
  const { isEmployee, loading } = useAuth();
  if (loading) return <Loader text="Authenticating..." />;
  if (!isEmployee) return <Navigate to="/" replace />;
  return children;
};

const RoleRedirect = () => {
  const { isManager } = useAuth();
  return <Navigate to={isManager ? '/manager' : '/employee'} replace />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={isAuthenticated ? <RoleRedirect /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <RoleRedirect /> : <Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/two-factor" element={<TwoFactorAuth />} />

      {/* Manager */}
      <Route path="/manager" element={<ProtectedRoute><ManagerRoute><ManagerHome /></ManagerRoute></ProtectedRoute>} />
      <Route path="/create-project" element={<ProtectedRoute><ManagerRoute><CreateProject /></ManagerRoute></ProtectedRoute>} />
      <Route path="/task-assignment" element={<ProtectedRoute><ManagerRoute><TaskAssignment /></ManagerRoute></ProtectedRoute>} />
      <Route path="/risk-prediction" element={<ProtectedRoute><ManagerRoute><RiskPrediction /></ManagerRoute></ProtectedRoute>} />
      <Route path="/employee-performance" element={<ProtectedRoute><ManagerRoute><EmployeePerformance /></ManagerRoute></ProtectedRoute>} />

      {/* Employee */}
      <Route path="/employee" element={<ProtectedRoute><EmployeeRoute><EmployeeHome /></EmployeeRoute></ProtectedRoute>} />
      <Route path="/daily-progress" element={<ProtectedRoute><EmployeeRoute><DailyProgressUpdate /></EmployeeRoute></ProtectedRoute>} />

      {/* Shared — accessible by all authenticated users */}
      <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
      <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
      <Route path="/tasks/:id" element={<ProtectedRoute><TaskDetail /></ProtectedRoute>} />
      <Route path="/kanban" element={<ProtectedRoute><KanbanBoard /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path="/weekly-summary" element={<ProtectedRoute><WeeklySummaryPage /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
      <Route path="/alert-center" element={<ProtectedRoute><AlertCenterPage /></ProtectedRoute>} />
      <Route path="/ai-insights" element={<ProtectedRoute><AIInsightsPage /></ProtectedRoute>} />
      <Route path="/collaboration" element={<ProtectedRoute><CollaborationPage /></ProtectedRoute>} />
      <Route path="/smart-planning" element={<ProtectedRoute><SmartPlanningPage /></ProtectedRoute>} />
      <Route path="/jira-integration" element={<ProtectedRoute><JiraIntegrationPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      {/* Default */}
      <Route path="/" element={isAuthenticated ? <RoleRedirect /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AlertProvider>
            <AppRoutes />
          </AlertProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
