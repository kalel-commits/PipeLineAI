import React, { useState } from 'react';
import api from '../services/api';
import { Box, Button, Typography, LinearProgress, Alert } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';

const ModelTraining = ({ datasetId, onTrained }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleTrain = async () => {
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await api.post(`/models/train?dataset_id=${datasetId}`);
      setResult(res.data);
      if (onTrained) onTrained(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Training failed');
    }
    setLoading(false);
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Clicking train will simultaneously train Logistic Regression, Decision Tree, Random Forest, and a Voting Ensemble.
      </Typography>

      {loading && <LinearProgress sx={{ mb: 2 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {result && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Successfully trained {result.models?.length} models!
        </Alert>
      )}

      <Button
        variant="contained" onClick={handleTrain}
        disabled={loading}
        startIcon={<PsychologyIcon />}
        sx={{ borderRadius: 2 }}
      >
        {loading ? 'Training All Models…' : 'Train Models'}
      </Button>
    </Box>
  );
};

export default ModelTraining;
