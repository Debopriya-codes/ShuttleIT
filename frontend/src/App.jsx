import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RideTracking from './pages/RideTracking';
import DriverPanel from './pages/DriverPanel';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'driver' ? '/driver' : '/dashboard'} replace />;
  }
  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute allowedRole="rider"><Dashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/tracking" 
        element={<ProtectedRoute allowedRole="rider"><RideTracking /></ProtectedRoute>} 
      />
      <Route 
        path="/driver" 
        element={<ProtectedRoute allowedRole="driver"><DriverPanel /></ProtectedRoute>} 
      />
    </Routes>
  );
};

export default App;
