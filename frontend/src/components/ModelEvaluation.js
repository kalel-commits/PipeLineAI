import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Bar } from 'react-chartjs-2';
import { Box, Typography, Alert, CircularProgress, Grid, Divider } from '@mui/material';

const METRICS = [
  { key: 'accuracy', label: 'Accuracy', color: '#6366f1' },
  { key: 'precision', label: 'Precision', color: '#10b981' },
  { key: 'recall', label: 'Recall', color: '#f59e0b' },
  { key: 'f1', label: 'F1 Score', color: '#3b82f6' },
];

const ModelEvaluation = ({ modelId }) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!modelId) return;
    setLoading(true);
    api.get(`/models/${modelId}/evaluate`)
      .then(res => setMetrics(res.data.metrics))
      .catch(err => setError(err.response?.data?.detail || 'Evaluation failed'))
      .finally(() => setLoading(false));
  }, [modelId]);

  if (!modelId) return null;
  if (loading) return <Box sx={{ py: 4, textAlign: 'center' }}><CircularProgress size={28} sx={{ color: 'var(--primary)' }} /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!metrics) return null;

  const confusion = metrics.confusion_matrix;
  const cv = metrics.cv || {};
  const importances = metrics.feature_importances || [];

  const mainChartData = {
    labels: METRICS.map(m => m.label),
    datasets: [{
      label: '5-Fold CV Mean Score',
      data: METRICS.map(m => cv[`${m.key}_mean`] || metrics[m.key === 'f1' ? 'f1_score' : m.key]),
      backgroundColor: METRICS.map(m => `${m.color}bb`),
      borderColor: METRICS.map(m => m.color),
      borderWidth: 1.5,
      borderRadius: 6,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        min: 0, max: 1,
        ticks: { color: '#6b7280', callback: v => `${(v * 100).toFixed(0)}%`, font: { size: 11 } },
        grid: { color: 'rgba(255,255,255,0.04)' },
        border: { color: 'transparent' }
      },
      x: {
        ticks: { color: '#6b7280', font: { size: 11 } },
        grid: { display: false },
        border: { color: 'transparent' }
      }
    },
  };

  const fiChartData = {
    labels: importances.map(f => f.feature),
    datasets: [{
      label: 'Importance',
      data: importances.map(f => f.importance),
      backgroundColor: '#8b5cf6bb',
      borderColor: '#8b5cf6',
      borderWidth: 1,
      borderRadius: 4,
    }]
  };

  const fiChartOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        min: 0,
        ticks: { color: '#6b7280', font: { size: 10 } },
        grid: { color: 'rgba(255,255,255,0.04)' },
        border: { color: 'transparent' }
      },
      y: {
        ticks: { color: '#9ca3af', font: { size: 11 } },
        grid: { display: false },
        border: { color: 'transparent' }
      }
    },
  };

  return (
    <Box>
      {/* Split Info */}
      <Box sx={{ display: 'flex', gap: 4, mb: 3, px: 2, py: 1.5, background: 'rgba(255,255,255,0.02)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Train Set Size</Typography>
          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#f9fafb' }}>{metrics.train_size || 'N/A'}</Typography>
        </Box>
        <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Test Set Size</Typography>
          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#f9fafb' }}>{metrics.test_size || 'N/A'}</Typography>
        </Box>
        <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Validation</Typography>
          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#10b981' }}>5-Fold Cross-Validation</Typography>
        </Box>
      </Box>

      {/* CV Metric tiles */}
      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        {METRICS.map(m => {
          const mean = cv[`${m.key}_mean`] || metrics[m.key === 'f1' ? 'f1_score' : m.key];
          const std = cv[`${m.key}_std`] || 0;
          return (
            <Grid item xs={6} sm={3} key={m.key}>
              <Box className="metric-tile" sx={{ position: 'relative' }}>
                <Typography sx={{ fontSize: '1.875rem', fontWeight: 800, color: m.color, letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {(mean * 100).toFixed(1)}
                  <Box component="span" sx={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>%</Box>
                </Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mt: 0.5, fontSize: '0.75rem' }}>
                  ± {(std * 100).toFixed(2)}% std
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontWeight: 600 }}>
                  {m.label} (CV)
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3}>
        {/* Main Chart */}
        <Grid item xs={12} md={7}>
          <Typography className="section-label" sx={{ mb: 1.5 }}>CV Metrics Overview</Typography>
          <Box sx={{ height: 200 }}>
            <Bar data={mainChartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
          </Box>
        </Grid>

        {/* Confusion Matrix (Test Set) */}
        <Grid item xs={12} md={5}>
          <Typography className="section-label" sx={{ mb: 1.5 }}>Unseen Test Set Confusion Matrix</Typography>
          {confusion && (
            <Box>
              <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5, ml: 9 }}>
                {['Pred: Fail', 'Pred: Pass'].map(l => (
                  <Typography key={l} variant="caption" color="text.secondary" sx={{ width: 80, textAlign: 'center', fontSize: '0.65rem' }}>{l}</Typography>
                ))}
              </Box>
              {confusion.map((row, r) => (
                <Box key={r} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ width: 80, fontSize: '0.65rem', textAlign: 'right', pr: 1 }}>
                    {r === 0 ? 'True: Fail' : 'True: Pass'}
                  </Typography>
                  {row.map((val, c) => (
                    <Box key={c} sx={{
                      width: 80, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: 2, flexDirection: 'column', gap: 0.5,
                      background: r === c ? 'rgba(99,102,241,0.14)' : 'rgba(239,68,68,0.08)',
                      border: `1px solid ${r === c ? 'rgba(99,102,241,0.3)' : 'rgba(239,68,68,0.2)'}`,
                    }}>
                      <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: r === c ? '#818cf8' : '#ef4444', lineHeight: 1 }}>
                        {val}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          )}
        </Grid>

        {/* Feature Importances (if available) */}
        {importances.length > 0 && (
          <Grid item xs={12}>
            <Box sx={{ mt: 2, p: 3, background: '#111827', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <Typography className="section-label" sx={{ mb: 2 }}>Model Insights: Feature Importance</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                The relative contribution of each feature to the model's predictive decisions during training.
              </Typography>
              <Box sx={{ height: Math.max(200, importances.length * 30) }}>
                <Bar data={fiChartData} options={{ ...fiChartOptions, maintainAspectRatio: false }} />
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ModelEvaluation;
