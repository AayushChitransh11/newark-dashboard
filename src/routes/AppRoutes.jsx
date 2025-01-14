import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import GovernmentDashboard from '../pages/GovernmentDashboard';
import ServiceProviderDashboard from '../pages/ServiceProviderDashboard';
import ParticipantDashboard from '../pages/ParticipantDashboard';

export default function AppRoutes() {
  const authToken = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');

  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          userRole === 'government' ? (
            <GovernmentDashboard />
          ) : userRole === 'serviceProvider' ? (
            <ServiceProviderDashboard />
          ) : userRole === 'participant' ? (
            <ParticipantDashboard />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
      <Route path="/unauthorized" element={<h1>Access Denied</h1>} />
    </Routes>
  );
}
