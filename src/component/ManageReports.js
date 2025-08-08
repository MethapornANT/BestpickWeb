// src/pages/ManageReportedPosts.jsx (no overflow, balanced widths)
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import {
  AppBar, Toolbar, Typography, Button, Box, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, InputLabel, Select, MenuItem, CssBaseline,
  Drawer, List, ListItem, ListItemText, ListItemIcon, Divider,
  Avatar, TextField, Chip, Tooltip, useMediaQuery
} from '@mui/material';

import { ThemeProvider, createTheme, styled, alpha } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';

import { useAuth } from '../AuthContext';

/* ---------------- Animations ---------------- */
const fadeIn = keyframes`
  from { opacity:0; transform: translateY(8px); }
  to { opacity:1; transform: translateY(0); }
`;
const auroraShift = keyframes`
  0% { transform: translate3d(-10%,-10%,0) scale(1); }
  50% { transform: translate3d(10%,10%,0) scale(1.06); }
  100% { transform: translate3d(-10%,-10%,0) scale(1); }
`;
const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
  100% { transform: translateY(0); }
`;

/* ---------------- Theme (same family as Ads/Orders/Posts) ---------------- */
const theme = createTheme({
  palette: {
    neutral: {
      900: '#0F1115', 800: '#13161D', 700: '#1B1F27', 600: '#2A2F3A',
      500: '#3A4150', 400: '#6B7280', 300: '#9CA3AF', 200: '#D1D5DB',
      100: '#E5E7EB', 50: '#F5F7FB'
    },
    pastel: {
      blue: '#DDEEFF',
      pink: '#FFE6F2',
      mint: '#E9FFF5',
      lemon: '#FFF9D9',
      lilac: '#F1E8FF'
    },
    primary: { main: '#1B1F27', contrastText: '#FFFFFF' },
    background: { default: '#F5F7FB', paper: '#FFFFFF' },
    text: { primary: '#1B1F27', secondary: '#5B6170' },
    divider: 'rgba(27,31,39,0.08)'
  },
  typography: {
    fontFamily: ['Inter','system-ui','Segoe UI','Roboto','sans-serif'].join(','),
    h2: { fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-0.02em' },
    button: { textTransform: 'none', fontWeight: 700 }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(19,22,29,0.88)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 12px 28px rgba(15,17,21,0.18)',
          borderRadius: 0
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 800, backgroundColor: '#fff', whiteSpace: 'nowrap' }
      }
    }
  }
});

/* ---------------- Pastel Aurora Background ---------------- */
const Backdrop = styled('div')(({ theme }) => ({
  position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0,
  background: `radial-gradient(1000px 500px at 15% -10%, ${alpha(theme.palette.pastel.blue,0.6)} 0%, transparent 60%),
               radial-gradient(900px 500px at 110% 30%, ${alpha(theme.palette.pastel.lilac,0.5)} 0%, transparent 65%),
               radial-gradient(900px 600px at 0% 100%, ${alpha(theme.palette.pastel.mint,0.45)} 0%, transparent 55%),
               ${theme.palette.background.default}`
}));
const Aurora = styled('div')(({ theme }) => ({
  position: 'absolute', left: '-20%', top: '-20%', width: '140%', height: '140%',
  background: `conic-gradient(from 0deg,
    ${alpha(theme.palette.pastel.blue,0.9)},
    ${alpha(theme.palette.pastel.pink,0.9)},
    ${alpha(theme.palette.pastel.mint,0.9)},
    ${alpha(theme.palette.pastel.lemon,0.9)},
    ${alpha(theme.palette.pastel.lilac,0.9)},
    ${alpha(theme.palette.pastel.blue,0.9)})`,
  filter: 'blur(80px)',
  mixBlendMode: 'multiply',
  animation: `${auroraShift} 30s ease-in-out infinite`,
  opacity: 1
}));
const Particle = styled('span')(({ size = 8, x = 50, y = 50, delay = 0 }) => ({
  position: 'absolute',
  left: `${x}%`, top: `${y}%`,
  width: size, height: size, borderRadius: 999,
  background: `linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,255,255,0.4))`,
  boxShadow: `0 0 ${size * 1.4}px rgba(27,31,39,0.08)`,
  animation: `${float} ${6 + (size % 7)}s ease-in-out ${delay}s infinite`,
  opacity: 0.9
}));

/* ---------------- Reusable UI ---------------- */
const TableShell = styled(TableContainer)(({ theme }) => ({
  animation: `${fadeIn} .5s ease-out`,
  width: '100%',
  maxWidth: '100%',
  margin: 0,
  overflowX: 'hidden', // prevent horizontal scroll; cells will ellipsize
  boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
}));
const HoverRow = styled(TableRow)(({ theme }) => ({
  transition: 'transform .18s ease, background .18s ease',
  '&:hover': { background: alpha(theme.palette.pastel.blue, .28) }
}));
const PastelIconBtn = ({ color, children, ...props }) => (
  <IconButton
    {...props}
    sx={{
      width: 34, height: 34,
      bgcolor: theme.palette.pastel[color] || theme.palette.pastel.blue,
      '&:hover': { bgcolor: alpha(theme.palette.pastel[color] || theme.palette.pastel.blue, .85) }
    }}
  >
    {children}
  </IconButton>
);
const StatusChip = ({ value }) => {
  const v = String(value || '').toLowerCase();
  const map = {
    pending: { bg: theme.palette.pastel.lemon, label: 'pending' },
    normally: { bg: theme.palette.pastel.mint, label: 'normally' },
    block: { bg: theme.palette.pastel.pink, label: 'block' }
  };
  const s = map[v] || { bg: theme.palette.neutral[100], label: v || 'N/A' };
  return (
    <Chip
      size="small"
      label={s.label}
      sx={{ bgcolor: s.bg, fontWeight: 800, borderRadius: 999, height: 24, color: theme.palette.neutral[900] }}
    />
  );
};
const oneLine = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' };

/* ---------------- Component ---------------- */
const ManageReportedPosts = () => {
  const { handleLogout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));

  const [reportedPosts, setReportedPosts] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const menuItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Manage Advertisements', path: '/manageadd', icon: <AddCircleIcon /> },
    { text: 'Manage Order', path: '/manageorder', icon: <ShoppingCartIcon /> },
    { text: 'Manage User', path: '/manageuser', icon: <PeopleIcon /> },
    { text: 'Manage Post', path: '/managepost', icon: <AssignmentIcon /> },
    { text: 'Report posts', path: '/manage-reported-posts', icon: <ReportProblemIcon /> },
    { text: 'Manage Categories', path: '/managecategories', icon: <CategoryIcon /> },
  ];

  useEffect(() => { if (!isAdmin()) navigate('/login'); }, [isAdmin, navigate]);

  const fetchReported = useCallback(async (q='') => {
    const token = localStorage.getItem('token');
    try {
      const url = q
        ? `${process.env.REACT_APP_BASE_URL}/admin/search/reports?q=${encodeURIComponent(q)}`
        : `${process.env.REACT_APP_BASE_URL}/admin/reported-posts`;
      const res = await axios.get(url, { headers:{ Authorization:`Bearer ${token}` }});
      if (Array.isArray(res.data)) setReportedPosts(res.data);
      else if (res.data?.results) setReportedPosts(res.data.results);
      else setReportedPosts([]);
    } catch (e) {
      setReportedPosts([]);
      if (e?.response?.status === 401) { handleLogout(); navigate('/login'); }
    }
  }, [handleLogout, navigate]);

  useEffect(() => {
    const h = setTimeout(()=> setCurrentSearchTerm(searchQuery), 300);
    return () => clearTimeout(h);
  }, [searchQuery]);

  useEffect(() => { fetchReported(currentSearchTerm); }, [currentSearchTerm, fetchReported]);

  const getFirstPhotoUrl = (arr) => {
    if (!Array.isArray(arr)) return null;
    const first = arr.find(u => typeof u === 'string' && u.trim() !== '');
    if (!first) return null;
    const base = process.env.REACT_APP_BASE_URL?.replace(/\/$/,'') || '';
    return first.startsWith('/uploads/') ? `${base}${first}` : first;
  };

  const sorted = useMemo(() => {
    const order = { pending: 1, normally: 2, block: 3 };
    return [...reportedPosts].sort((a,b)=>{
      const s = (order[a.status]||99) - (order[b.status]||99);
      if (s !== 0) return s;
      return new Date(b.reported_at) - new Date(a.reported_at);
    });
  }, [reportedPosts]);

  // Responsive, clamped column widths so the table NEVER exceeds viewport
  const col = {
    img: 'clamp(56px, 8vw, 96px)',
    id: 'clamp(96px, 10vw, 132px)',
    title: 'clamp(160px, 24vw, 300px)',
    by: 'clamp(120px, 16vw, 200px)',
    reason: 'clamp(140px, 20vw, 240px)',
    at: 'clamp(132px, 18vw, 200px)',
    status: 'clamp(96px, 10vw, 120px)',
    actions: 'clamp(88px, 8vw, 108px)'
  };

  const handleSave = async () => {
    if (!selectedReport) return;
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/admin/reports/${selectedReport.report_id}`,
        { status: selectedReport.status },
        { headers:{ Authorization:`Bearer ${token}`, 'Content-Type':'application/json' } }
      );
      setOpenEdit(false);
      fetchReported(currentSearchTerm);
    } catch (e) {
      alert('Failed to update report status');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Pastel background */}
      <Backdrop>
        <Aurora />
        {[{size:6,x:12,y:22,delay:.2},{size:10,x:28,y:66,delay:.4},{size:8,x:70,y:28,delay:.1},{size:12,x:84,y:58,delay:.5},{size:9,x:45,y:40,delay:.3},{size:7,x:60,y:75,delay:.2}]
          .map((p,i)=><Particle key={i} {...p} />)}
      </Backdrop>

      {/* AppBar */}
      <AppBar position="fixed">
        <Toolbar sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:2 }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
            <IconButton edge="start" color="inherit" onClick={()=>setIsDrawerOpen(true)} sx={{ mr:1 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight:800 }}>Manage Reported Posts</Typography>
          </Box>

          <Box sx={{ display:'flex', alignItems:'center', gap:2, ml:'auto' }}>
            <TextField
              variant="outlined" size="small" placeholder="Search reports..."
              value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}
              InputProps={{ startAdornment:<SearchIcon sx={{ mr:1, color:'action.active' }}/> }}
              sx={{
                width:{ xs:220, sm:320 },
                '& .MuiOutlinedInput-root': {
                  borderRadius:'999px', bgcolor:'#fff',
                  boxShadow:'0 4px 12px rgba(0,0,0,0.08)'
                }
              }}
            />
            <Button color="inherit" onClick={handleLogout} startIcon={<ExitToAppIcon/>}
              sx={{ bgcolor:'#fff', color:'text.primary', borderRadius:1, px:2, '&:hover':{ bgcolor:'neutral.100' } }}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={()=>setIsDrawerOpen(false)}>
        <Box
          sx={{ width:280, background:'linear-gradient(180deg, rgba(19,22,29,0.96), rgba(19,22,29,0.92))', color:'#fff', height:'100%' }}
          role="presentation" onClick={()=>setIsDrawerOpen(false)}
        >
          <Box sx={{ p:2.5 }}>
            <Typography sx={{ fontWeight:800, letterSpacing:'.06em' }}>MENU</Typography>
          </Box>
          <Divider sx={{ borderColor:'rgba(255,255,255,0.08)' }} />
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.text} component={Link} to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  mx:1.2, my:0.6, borderRadius:0, color:'#fff',
                  '& .MuiListItemIcon-root': { color:'#fff', minWidth:36 },
                  '&.Mui-selected': { background: alpha('#fff',0.08) },
                  '&:hover': { background: alpha('#fff',0.12) }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main */}
      <Box sx={{ position:'relative', zIndex:1, px:{ xs:2, md:4 }, pt:{ xs:12, md:14 }, pb:6, maxWidth:'100%', mx:'auto' }}>
        <Box sx={{ textAlign:'center', mb:3 }}>
          <Typography variant="h2">Reported Posts</Typography>
        </Box>

        <TableShell component={Paper}>
          <Table stickyHeader sx={{ tableLayout:'fixed', width:'100%' }}>
            <colgroup>
              <col style={{ width: col.img }} />
              <col style={{ width: col.id }} />
              <col style={{ width: col.title }} />
              <col style={{ width: col.by }} />
              <col style={{ width: col.reason }} />
              <col style={{ width: col.at }} />
              <col style={{ width: col.status }} />
              <col style={{ width: col.actions }} />
            </colgroup>

            <TableHead>
              <TableRow>
                <TableCell>Post Image</TableCell>
                <TableCell>Post ID</TableCell>
                <TableCell>Post Title</TableCell>
                <TableCell>Reported By</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Reported At</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sorted.length === 0 ? (
                <TableRow><TableCell colSpan={8} align="center">No reports found.</TableCell></TableRow>
              ) : sorted.map((r) => {
                const img = getFirstPhotoUrl(r.post_image_url);
                return (
                  <HoverRow key={r.report_id}>
                    <TableCell>
                      {img ? (
                        <a href={img} target="_blank" rel="noopener noreferrer">
                          <img src={img} alt="Post" style={{ width: 'clamp(44px, 6vw, 64px)', height: 'clamp(44px, 6vw, 64px)', objectFit:'cover', borderRadius:8 }} />
                        </a>
                      ) : (
                        <Avatar variant="rounded" sx={{ width:'clamp(44px, 6vw, 64px)', height:'clamp(44px, 6vw, 64px)', bgcolor: theme.palette.neutral[100], color: theme.palette.text.secondary }}>
                          N/A
                        </Avatar>
                      )}
                    </TableCell>

                    <TableCell><span style={oneLine}>{r.actual_post_id}</span></TableCell>

                    <TableCell>
                      <Tooltip title={r.post_title || ''} arrow>
                        <span style={oneLine}>{r.post_title}</span>
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <Tooltip title={r.reported_by_username || ''} arrow>
                        <span style={oneLine}>{r.reported_by_username}</span>
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <Tooltip title={r.reason || ''} arrow>
                        <span style={oneLine}>{r.reason}</span>
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <span style={oneLine}>
                        {r.reported_at ? new Date(r.reported_at).toLocaleString('en-GB') : '-'}
                      </span>
                    </TableCell>

                    <TableCell><StatusChip value={r.status} /></TableCell>

                    <TableCell>
                      <PastelIconBtn color="blue" onClick={()=>{ setSelectedReport(r); setOpenEdit(true); }}>
                        <EditIcon />
                      </PastelIconBtn>
                    </TableCell>
                  </HoverRow>
                );
              })}
            </TableBody>
          </Table>
        </TableShell>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={()=>setOpenEdit(false)} PaperProps={{ sx:{ p:0.5, minWidth:360 }}}>
        <DialogTitle sx={{ fontWeight:800 }}>Edit Report Status</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={selectedReport?.status || ''}
              onChange={(e)=> setSelectedReport({ ...selectedReport, status: e.target.value })}
            >
              <MenuItem value="block">Block</MenuItem>
              <MenuItem value="normally">Normally</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenEdit(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ManageReportedPosts;
