import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6366F1', light: '#818CF8', dark: '#4F46E5', contrastText: '#fff' },
    secondary: { main: '#10B981', light: '#34D399', dark: '#059669' },
    error: { main: '#EF4444' },
    warning: { main: '#F59E0B' },
    info: { main: '#3B82F6' },
    success: { main: '#10B981' },
    background: { default: '#0B0F19', paper: '#151C2E' },
    divider: 'rgba(255,255,255,0.06)',
    text: { primary: '#F9FAFB', secondary: '#9CA3AF', disabled: '#4B5563' },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, sans-serif",
    fontSize: 14,
    h1: { fontWeight: 800, letterSpacing: '-0.04em', fontSize: '2.5rem' },
    h2: { fontWeight: 800, letterSpacing: '-0.03em', fontSize: '2rem' },
    h3: { fontWeight: 700, letterSpacing: '-0.025em', fontSize: '1.75rem' },
    h4: { fontWeight: 700, letterSpacing: '-0.02em', fontSize: '2rem' },      // 32px page title
    h5: { fontWeight: 600, letterSpacing: '-0.01em', fontSize: '1.25rem' },   // 20px section
    h6: { fontWeight: 600, letterSpacing: '-0.01em', fontSize: '1rem' },      // 16px card title
    body1: { fontSize: '0.875rem', lineHeight: 1.7 },                          // 14px body
    body2: { fontSize: '0.875rem', lineHeight: 1.6, color: '#9CA3AF' },
    subtitle1: { fontWeight: 600, fontSize: '0.9375rem' },
    subtitle2: { fontWeight: 600, fontSize: '0.8125rem' },
    button: { fontWeight: 600, fontSize: '0.875rem', letterSpacing: '0' },
    caption: { fontSize: '0.75rem', color: '#6B7280' },
  },
  shape: { borderRadius: 14 },
  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.4)',
    '0 2px 4px rgba(0,0,0,0.4)',
    '0 4px 8px rgba(0,0,0,0.4)',
    '0 8px 32px rgba(0,0,0,0.25)',
    '0 16px 48px rgba(0,0,0,0.35)',
    ...Array(19).fill('0 16px 48px rgba(0,0,0,0.35)'),
  ],
  components: {
    MuiCssBaseline: { styleOverrides: { body: { backgroundImage: 'none', background: '#0B0F19' } } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none', fontWeight: 600, fontSize: '0.875rem',
          borderRadius: 10, transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
          padding: '8px 16px',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
          boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
          '&:hover': { background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', boxShadow: '0 4px 20px rgba(99,102,241,0.5)', transform: 'translateY(-1px)' },
        },
        outlined: {
          borderColor: 'rgba(255,255,255,0.1)',
          '&:hover': { borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.04)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#151C2E', border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)', backgroundImage: 'none', borderRadius: 14,
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none', background: '#151C2E', border: '1px solid rgba(255,255,255,0.06)' },
        elevation4: { boxShadow: '0 8px 32px rgba(0,0,0,0.25)' },
      }
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: '#111827', borderRadius: 10, fontSize: '0.875rem',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.16)' },
            '&.Mui-focused fieldset': { borderColor: '#6366F1' },
          },
          '& .MuiInputLabel-root': { fontSize: '0.875rem', color: '#6B7280' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#6366F1' },
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          background: '#111827', fontSize: '0.875rem',
          '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.16)' },
          '&.Mui-focused fieldset': { borderColor: '#6366F1' },
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: 'rgba(255,255,255,0.06)', padding: '10px 16px', fontSize: '0.875rem' },
        head: {
          fontWeight: 600, color: '#6B7280', fontSize: '11px',
          letterSpacing: '0.06em', textTransform: 'uppercase',
          background: '#111827', borderBottom: '1px solid rgba(255,255,255,0.06)',
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: { '&:hover td': { background: '#1B2438' }, transition: 'background 150ms' }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: '11px', height: 22, borderRadius: 6, letterSpacing: '0.01em' }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 99, background: 'rgba(255,255,255,0.06)', height: 6 },
        bar: { borderRadius: 99 }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10, border: '1px solid', fontSize: '0.875rem' },
        standardSuccess: { background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' },
        standardError: { background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)' },
        standardWarning: { background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.2)' },
        standardInfo: { background: 'rgba(99,102,241,0.08)', borderColor: 'rgba(99,102,241,0.2)' },
      }
    },
    MuiDivider: { styleOverrides: { root: { borderColor: 'rgba(255,255,255,0.06)' } } },
    MuiMenu: {
      styleOverrides: { paper: { background: '#1B2438', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' } }
    },
    MuiTooltip: {
      styleOverrides: { tooltip: { background: '#1B2438', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px', borderRadius: 8 } }
    },
    MuiPagination: {
      styleOverrides: { root: { '& .MuiPaginationItem-root': { borderRadius: 8, fontSize: '0.875rem' } } }
    }
  }
});

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
