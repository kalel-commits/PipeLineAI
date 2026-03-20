import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Box, Typography, CircularProgress, Alert, Grid } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import StorageIcon from '@mui/icons-material/Storage';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';

const STAT_CONFIG = [
  { key: 'total_users', label: 'Total Users', icon: PeopleIcon, color: '#6366f1' },
  { key: 'active_users', label: 'Active Users', icon: PersonIcon, color: '#10b981' },
  { key: 'locked_accounts', label: 'Locked Accounts', icon: LockIcon, color: '#ef4444' },
  { key: 'total_datasets', label: 'Datasets', icon: StorageIcon, color: '#f59e0b' },
  { key: 'processed_datasets', label: 'Processed', icon: CheckCircleIcon, color: '#10b981' },
  { key: 'total_models', label: 'Trained Models', icon: PsychologyIcon, color: '#3b82f6' },
  { key: 'most_used_algorithm', label: 'Top Algorithm', icon: EmojiEventsIcon, color: '#f59e0b' },
  { key: 'total_predictions', label: 'Predictions Run', icon: TrendingUpIcon, color: '#6366f1' },
];

const SystemStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const location = window.location; // Fallback since this is a component
  useEffect(() => {
    setLoading(true);
    api.get(`/admin/system-stats${location.search}`)
      .then(res => setStats(res.data))
      .catch(err => setError(err.response?.data?.detail || 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, [location.search]);

  if (loading) return <Box sx={{ py: 3, textAlign: 'center' }}><CircularProgress size={24} sx={{ color: 'var(--primary)' }} /></Box>;
  if (error) return <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>;
  if (!stats) return null;

  return (
    <Grid container spacing={1.5} sx={{ mb: 3 }}>
      {STAT_CONFIG.map(({ key, label, icon: Icon, color }) => (
        <Grid item xs={6} sm={4} md={3} key={key}>
          <Box sx={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            p: 2,
            transition: 'border-color 200ms, transform 200ms',
            '&:hover': { borderColor: `${color}40`, transform: 'translateY(-1px)' }
          }}>
            <Icon sx={{ fontSize: 18, color, mb: 1.25 }} />
            <Typography sx={{
              fontSize: typeof stats[key] === 'string' ? '1rem' : '1.625rem',
              fontWeight: 800,
              color,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              mb: 0.5,
            }}>
              {stats[key] ?? '—'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              {label}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default SystemStats;
