import React, { useState, useCallback } from 'react';
import api from '../services/api';
import { Box, Typography, LinearProgress, Alert, Chip, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const COLS = ['pipeline_status', 'execution_time', 'commit_id', 'files_changed', 'lines_added', 'lines_removed', 'commit_timestamp', 'developer_id'];

const DatasetUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleFile = (f) => {
    if (!f) return;
    if (!f.name.endsWith('.csv') && !f.name.endsWith('.json')) { setError('Only .csv or .json files are accepted'); return; }
    setFile(f); setError(''); setResult(null);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true); setError('');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await api.post('/datasets/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult(res.data);
      onUpload && onUpload(res.data);
    } catch (err) { setError(err.response?.data?.detail || 'Upload failed'); }
    setLoading(false);
  };

  return (
    <Box>
      {/* Drop zone */}
      <Box
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById('ds-upload-input').click()}
        sx={{
          border: `2px dashed ${drag ? '#6366F1' : 'rgba(99,102,241,0.3)'}`,
          borderRadius: '14px',
          background: drag ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.04)',
          py: 5, px: 3, textAlign: 'center', cursor: 'pointer',
          transition: 'all 250ms cubic-bezier(0.4,0,0.2,1)',
          '&:hover': { border: '2px dashed #6366F1', background: 'rgba(99,102,241,0.08)' },
          boxShadow: drag ? '0 0 0 4px rgba(99,102,241,0.12)' : 'none',
        }}
      >
        <input id="ds-upload-input" type="file" accept=".csv,.json" style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])} />

        {file ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <InsertDriveFileOutlinedIcon sx={{ fontSize: 28, color: '#6366F1' }} />
            <Box sx={{ textAlign: 'left' }}>
              <Typography fontWeight={600} fontSize={14} color="#F9FAFB">{file.name}</Typography>
              <Typography variant="caption" color="text.secondary">{(file.size / 1024).toFixed(1)} KB  ·  ready to upload</Typography>
            </Box>
          </Box>
        ) : (
          <>
            <Box sx={{
              width: 52, height: 52, borderRadius: '14px', mx: 'auto', mb: 2,
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CloudUploadIcon sx={{ fontSize: 26, color: '#6366F1' }} />
            </Box>
            <Typography fontWeight={600} fontSize={14} color="#F9FAFB" gutterBottom>
              Drag & drop your dataset here
            </Typography>
            <Typography fontSize={13} color="text.secondary">
              or <Box component="span" sx={{ color: '#818CF8', fontWeight: 600 }}>browse files</Box> — accepts .csv and .json (max 16 MB)
            </Typography>
          </>
        )}
      </Box>

      {/* Column hints */}
      <Box sx={{ mt: 1.5, display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
        {COLS.map(c => (
          <Chip key={c} label={c} size="small" variant="outlined"
            sx={{ fontSize: '11px', height: 20, borderColor: 'rgba(255,255,255,0.06)', color: '#4B5563', borderRadius: '5px' }} />
        ))}
      </Box>

      {loading && <LinearProgress sx={{ mt: 2, borderRadius: '4px' }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {result ? (
        <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mt: 2 }}>
          <strong>{result.record_count?.toLocaleString()}</strong> records imported · Dataset ID #{result.dataset_id}
        </Alert>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!file || loading}
            startIcon={<CloudUploadIcon />}
            sx={{ borderRadius: '10px' }}
          >
            {loading ? 'Uploading…' : 'Upload Dataset'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DatasetUpload;
