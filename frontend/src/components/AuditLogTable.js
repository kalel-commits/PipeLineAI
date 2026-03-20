import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Box, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, TextField, Button, Chip, Pagination, Alert,
  CircularProgress, Grid, Select, MenuItem, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const PAGE_SIZE = 20;

const statusStyle = {
  success: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' },
  failure: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' },
  failed: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' },
};

const StatusChip = ({ value }) => {
  const s = statusStyle[value?.toLowerCase()] || statusStyle.success;
  return (
    <Box component="span" sx={{
      px: 1, py: 0.25, borderRadius: '5px', fontSize: '0.7rem', fontWeight: 700,
      border: `1px solid ${s.border}`, background: s.bg, color: s.color, whiteSpace: 'nowrap'
    }}>
      {value || 'success'}
    </Box>
  );
};

const AuditLogTable = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ user: '', role: '', action: '', status: '', start: '', end: '' });

  useEffect(() => { fetchLogs(); }, [page]);

  const location = window.location; 
  const fetchLogs = async () => {
    setLoading(true); setError('');
    try {
      const demoParam = new URLSearchParams(location.search).get('demo');
      const params = { 
        page, 
        size: PAGE_SIZE, 
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)),
        ...(demoParam ? { demo: demoParam } : {})
      };
      const res = await api.get('/admin/audit-logs', { params });
      setLogs(res.data.logs || []);
      setTotal(res.data.total || 0);
    } catch (err) { setError(err.response?.data?.detail || 'Failed to load'); }
    setLoading(false);
  };

  const handleExport = async (type) => {
    try {
      const params = { export: type, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) };
      const res = await api.get('/admin/audit-logs/export', { params, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url; a.download = `audit-logs.${type}`; a.click();
    } catch { alert('Export failed'); }
  };

  return (
    <Box>
      {/* Filter toolbar */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small" placeholder="Search action…" value={filters.action}
          onChange={e => setFilters(f => ({ ...f, action: e.target.value }))}
          sx={{ minWidth: 180 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></InputAdornment> }}
        />
        <Select size="small" displayEmpty value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          sx={{ minWidth: 120, fontSize: '0.8125rem' }}
        >
          <MenuItem value=""><em style={{ color: 'var(--text-muted)' }}>All statuses</em></MenuItem>
          <MenuItem value="success">Success</MenuItem>
          <MenuItem value="failure">Failure</MenuItem>
        </Select>
        <Select size="small" displayEmpty value={filters.role}
          onChange={e => setFilters(f => ({ ...f, role: e.target.value }))}
          sx={{ minWidth: 120, fontSize: '0.8125rem' }}
        >
          <MenuItem value=""><em style={{ color: 'var(--text-muted)' }}>All roles</em></MenuItem>
          <MenuItem value="Developer">Developer</MenuItem>
          <MenuItem value="Analyst">Analyst</MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
        </Select>
        <TextField size="small" type="date" value={filters.start}
          onChange={e => setFilters(f => ({ ...f, start: e.target.value }))}
          InputLabelProps={{ shrink: true }} label="From" sx={{ width: 140 }} />
        <TextField size="small" type="date" value={filters.end}
          onChange={e => setFilters(f => ({ ...f, end: e.target.value }))}
          InputLabelProps={{ shrink: true }} label="To" sx={{ width: 140 }} />
        <Button variant="contained" size="small" onClick={() => { setPage(1); fetchLogs(); }}
          sx={{ borderRadius: 2, minWidth: 0 }}>Apply</Button>
        <Box sx={{ flex: 1 }} />
        <Button variant="outlined" size="small" startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
          onClick={() => handleExport('csv')} sx={{ borderRadius: 2 }}>CSV</Button>
        <Button variant="outlined" size="small" color="error" startIcon={<PictureAsPdfIcon sx={{ fontSize: 14 }} />}
          onClick={() => handleExport('pdf')} sx={{ borderRadius: 2 }}>PDF</Button>
      </Box>

      {loading && <Box sx={{ py: 4, textAlign: 'center' }}><CircularProgress size={24} sx={{ color: 'var(--primary)' }} /></Box>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>IP</TableCell>
              <TableCell align="right">Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map(l => (
              <TableRow key={l.id}>
                <TableCell sx={{ fontWeight: 500 }}>{l.user_name || '—'}</TableCell>
                <TableCell><Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>{l.role || '—'}</Typography></TableCell>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{l.action}</TableCell>
                <TableCell><StatusChip value={l.status} /></TableCell>
                <TableCell sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.ip_address || '—'}</TableCell>
                <TableCell align="right" sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {l.timestamp?.replace('T', ' ').substring(0, 19)}
                </TableCell>
              </TableRow>
            ))}
            {!loading && !logs.length && (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', color: 'var(--text-muted)', py: 5 }}>
                  No audit logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {total > PAGE_SIZE && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Pagination count={Math.ceil(total / PAGE_SIZE)} page={page} onChange={(_, p) => setPage(p)} size="small" />
        </Box>
      )}
    </Box>
  );
};

export default AuditLogTable;
