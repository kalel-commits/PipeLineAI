import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DeveloperDashboard from './DeveloperDashboard';
import AnalystDashboard from './AnalystDashboard';
import AdminDashboard from './AdminDashboard';
import { Box, Typography } from '@mui/material';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  if (!user) return null;
  if (user.role === 'Developer') return <DeveloperDashboard />;
  if (user.role === 'Analyst') return <AnalystDashboard />;
  if (user.role === 'Admin') return <AdminDashboard />;
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography color="error">Unauthorized role: {user.role}</Typography>
    </Box>
  );
};

export default DashboardPage;
