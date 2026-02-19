import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import { useContext } from 'react';
import Loader from './components/common/Loader';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ManagerHome from './pages/ManagerHome';
import EmployeeHome from './pages/EmployeeHome';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetail from './pages/ProjectDetail';
import TaskDetail from './pages/TaskDetail';
import ReportsPage from './pages/ReportsPage';
import AlertsPage from './pages/AlertsPage';
import CreateProject from './pages/CreateProject';
import TaskAssignment from './pages/TaskAssignment';
import DailyProgressUpdate from './pages/DailyProgressUpdate';
import RiskPrediction from './pages/RiskPrediction';
import EmployeePerformance from './pages/EmployeePerformance';

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

      {/* Manager */}
      <Route path="/manager" element={<ProtectedRoute><ManagerRoute><ManagerHome /></ManagerRoute></ProtectedRoute>} />
      <Route path="/create-project" element={<ProtectedRoute><ManagerRoute><CreateProject /></ManagerRoute></ProtectedRoute>} />
      <Route path="/task-assignment" element={<ProtectedRoute><ManagerRoute><TaskAssignment /></ManagerRoute></ProtectedRoute>} />
      <Route path="/risk-prediction" element={<ProtectedRoute><ManagerRoute><RiskPrediction /></ManagerRoute></ProtectedRoute>} />
      <Route path="/employee-performance" element={<ProtectedRoute><ManagerRoute><EmployeePerformance /></ManagerRoute></ProtectedRoute>} />

      {/* Employee */}
      <Route path="/employee" element={<ProtectedRoute><EmployeeRoute><EmployeeHome /></EmployeeRoute></ProtectedRoute>} />
      <Route path="/daily-progress" element={<ProtectedRoute><EmployeeRoute><DailyProgressUpdate /></EmployeeRoute></ProtectedRoute>} />

      {/* Shared */}
      <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
      <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
      <Route path="/tasks/:id" element={<ProtectedRoute><TaskDetail /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />

      {/* Default */}
      <Route path="/" element={isAuthenticated ? <RoleRedirect /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AlertProvider>
          <AppRoutes />
        </AlertProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;

