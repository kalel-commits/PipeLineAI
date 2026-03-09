import React, { useState } from 'react';
import api from '../services/api';
import {
  Box, Button, Typography, Alert, LinearProgress
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlurOnIcon from '@mui/icons-material/BlurOn';

const Step = ({ num, label, done, active }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.25 }}>
    <Box sx={{
      width: 22, height: 22, borderRadius: '50%', fontSize: '0.7rem', fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      background: done ? 'var(--success)' : active ? 'var(--primary)' : 'var(--border)',
      color: done || active ? '#fff' : 'var(--text-muted)',
      transition: 'all 300ms',
    }}>
      {done ? '✓' : num}
    </Box>
    <Typography variant="caption" sx={{
      fontWeight: 600,
      color: done ? 'var(--success)' : active ? 'var(--primary-light)' : 'var(--text-muted)',
      transition: 'color 300ms'
    }}>
      {label}
    </Typography>
  </Box>
);

const FeatureExtraction = ({ datasetId, onExtracted }) => {
  const [preprocessDone, setPreprocessDone] = useState(false);
  const [extractDone, setExtractDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async (action) => {
    setLoading(true); setError('');
    try {
      if (action === 'preprocess') {
        await api.post(`/datasets/preprocess/${datasetId}`);
        setPreprocessDone(true);
      } else {
        const res = await api.post(`/datasets/${datasetId}/extract-features`);
        setExtractDone(true);
        onExtracted && onExtracted(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.detail || `${action} failed`);
    }
    setLoading(false);
  };

  const activeStep = !preprocessDone ? 0 : !extractDone ? 1 : 2;

  return (
    <Box>
      {/* Step indicators */}
      <Box sx={{ display: 'flex', gap: 3, mb: 2.5, flexWrap: 'wrap' }}>
        <Step num={1} label="Preprocess" done={preprocessDone} active={activeStep === 0} />
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'var(--border)' }}>→</Box>
        <Step num={2} label="Extract Features" done={extractDone} active={activeStep === 1} />
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Button
          variant={preprocessDone ? 'outlined' : 'contained'}
          onClick={() => run('preprocess')}
          disabled={loading || preprocessDone}
          startIcon={preprocessDone ? <CheckCircleIcon sx={{ color: 'var(--success)' }} /> : <TuneIcon />}
          color={preprocessDone ? 'success' : 'primary'}
          sx={{ borderRadius: 2 }}
        >
          {preprocessDone ? 'Preprocessed' : 'Run Preprocessing'}
        </Button>
        <Button
          variant={extractDone ? 'outlined' : 'contained'}
          onClick={() => run('extract')}
          disabled={loading || !preprocessDone || extractDone}
          startIcon={extractDone ? <CheckCircleIcon sx={{ color: 'var(--success)' }} /> : <BlurOnIcon />}
          color={extractDone ? 'success' : 'primary'}
          sx={{ borderRadius: 2 }}
        >
          {extractDone ? 'Features Extracted' : 'Extract Features'}
        </Button>
      </Box>

      {extractDone && (
        <Alert severity="success" sx={{ mt: 2 }}>Features extracted — ready to train models.</Alert>
      )}
    </Box>
  );
};

export default FeatureExtraction;
