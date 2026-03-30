import React from 'react';
import { DashboardProvider } from '../contexts/DashboardContext';
import DashboardPageContent from '../components/dashboard/DashboardPageContent';

const Dashboard = () => {
  return (
    <DashboardProvider>
      <DashboardPageContent />
    </DashboardProvider>
  );
};

export default Dashboard;