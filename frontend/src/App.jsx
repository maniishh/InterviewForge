import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';

import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Setup from './pages/Setup';
import Interview from './pages/Interview';
import Feedback from './pages/Feedback';
import History from './pages/History';
import Spinner from './components/ui/Spinner';
import Analytics from './pages/Analytics';


const App = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base">
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/setup"
          element={
            <ProtectedRoute>
              <Setup />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <Interview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/setup" replace />} />
        <Route path="*" element={<Navigate to="/setup" replace />} />
        <Route path="/analytics" element={
  <ProtectedRoute><Analytics /></ProtectedRoute>
} />
      </Routes>
    </div>
  );
};

export default App;