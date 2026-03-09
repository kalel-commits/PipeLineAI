import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Tooltip } from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';

const roles = [
  { id: 'Developer', emoji: '🧑‍💻', color: '#6366F1', bg: 'rgba(99,102,241,' },
  { id: 'Analyst', emoji: '📊', color: '#10B981', bg: 'rgba(16,185,129,' },
  { id: 'Admin', emoji: '🛡️', color: '#F59E0B', bg: 'rgba(245,158,11,' },
];

const Navbar = () => {
  const { user, switchRole } = useContext(AuthContext);
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const currentRole = user?.role || 'Developer';
  const activeRole = roles.find(r => r.id === currentRole) || roles[0];

  return (
    <AppBar position="sticky" elevation={0} sx={{
      background: isLanding ? 'rgba(11,15,25,0)' : 'rgba(11,15,25,0.92)',
      borderBottom: isLanding ? 'none' : '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
    }}>
      <Toolbar sx={{ minHeight: 60, px: { xs: 2, md: '2rem' }, maxWidth: 1200, width: '100%', mx: 'auto', gap: 2 }}>

        {/* Logo */}
        <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1.25, textDecoration: 'none', mr: 2, '&:hover': { opacity: 0.85 } }}>
          <Box sx={{
            width: 32, height: 32, borderRadius: '9px', flexShrink: 0,
            background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 14px rgba(99,102,241,0.45)',
          }}>
            <AutoGraphIcon sx={{ fontSize: 18, color: '#fff' }} />
          </Box>
          <Typography fontWeight={700} fontSize={15} color="#F9FAFB" sx={{ letterSpacing: '-0.01em' }}>
            PipelineAI
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Role segmented control (prominent, always visible on dashboard) */}
        {!isLanding && (
          <Box sx={{
            display: 'flex',
            background: '#111827',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px',
            p: '4px',
            gap: '2px',
          }}>
            {roles.map(r => {
              const active = r.id === currentRole;
              return (
                <Tooltip key={r.id} title={`Switch to ${r.id} view`} arrow>
                  <Box
                    onClick={() => switchRole && switchRole(r.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      px: { xs: 1.5, sm: 2 },
                      py: '8px',
                      borderRadius: '9px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                      whiteSpace: 'nowrap',
                      transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
                      background: active
                        ? `${r.bg}0.18)`
                        : 'transparent',
                      color: active ? r.color : '#6B7280',
                      border: active
                        ? `1px solid ${r.bg}0.30)`
                        : '1px solid transparent',
                      boxShadow: active ? `0 2px 8px ${r.bg}0.15)` : 'none',
                      '&:hover': !active ? { background: 'rgba(255,255,255,0.04)', color: '#9CA3AF' } : {},
                      userSelect: 'none',
                    }}
                  >
                    <Box component="span" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, lineHeight: 1 }}>{r.emoji}</Box>
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{r.id}</Box>
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        )}

        {/* Nav link */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isLanding ? (
            <Box component={Link} to="/dashboard" sx={{
              display: 'flex', alignItems: 'center', gap: 0.75, px: 1.75, py: 0.875,
              borderRadius: '9px', border: '1px solid rgba(255,255,255,0.1)',
              textDecoration: 'none', color: '#9CA3AF', fontSize: '0.8125rem', fontWeight: 600,
              transition: 'all 200ms', '&:hover': { background: 'rgba(255,255,255,0.05)', color: '#F9FAFB' }
            }}>
              <DashboardIcon sx={{ fontSize: 15 }} />
              <Box component="span">Open App</Box>
            </Box>
          ) : (
            <Box component={Link} to="/" sx={{
              display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 1,
              borderRadius: '8px', textDecoration: 'none', color: '#6B7280', fontSize: '0.8125rem',
              transition: 'color 200ms', '&:hover': { color: '#9CA3AF' }
            }}>
              <HomeIcon sx={{ fontSize: 16 }} />
            </Box>
          )}
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
