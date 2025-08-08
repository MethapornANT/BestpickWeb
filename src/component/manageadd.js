import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, ThemeProvider, createTheme,
  Drawer, List, ListItem, ListItemText, CssBaseline,
  Chip, Divider, ListItemIcon
} from '@mui/material';

import axios from 'axios';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import CategoryIcon from '@mui/icons-material/Category';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CancelIcon from '@mui/icons-material/Cancel';

import { useAuth } from '../AuthContext';
import { keyframes } from '@emotion/react';
import { styled, alpha } from '@mui/material/styles';

/* ===================== Animations ===================== */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;
const rowHover = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(-2px); }
`;
const auroraShift = keyframes`
  0% { transform: translate3d(-10%, -10%, 0) scale(1); }
  50% { transform: translate3d(10%, 10%, 0) scale(1.06); }
  100% { transform: translate3d(-10%, -10%, 0) scale(1); }
`;
const float = keyframes`
  from { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
  to { transform: translateY(0px); }
`;

/* ===================== Theme (match Dashboard) ===================== */
const theme = createTheme({
  palette: {
    neutral: {
      900: '#0F1115',
      800: '#13161D',
      700: '#1B1F27',
      600: '#2A2F3A',
      500: '#3A4150',
      400: '#6B7280',
      300: '#9CA3AF',
      200: '#D1D5DB',
      100: '#E5E7EB',
      50:  '#F5F7FB'
    },
    primary: { main: '#1B1F27', contrastText: '#FFFFFF' },
    pastel: {
      blue: '#DDEEFF',
      pink: '#FFE6F2',
      mint: '#E9FFF5',
      lemon: '#FFF9D9',
      lilac: '#F1E8FF'
    },
    background: { default: '#F5F7FB', paper: '#FFFFFF' },
    text: { primary: '#1B1F27', secondary: '#5B6170' },
    divider: 'rgba(27,31,39,0.08)'
  },
  typography: {
    fontFamily: ['Inter','system-ui','Segoe UI','Roboto','sans-serif'].join(','),
    h2: { fontWeight: 900, fontSize: '4.2rem', letterSpacing: '-0.02em' },
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
        head: {
          fontWeight: 800,
          backgroundColor: '#fff',
          whiteSpace: 'nowrap'
        }
      }
    }
  }
});

/* ===================== Styled ===================== */
const Backdrop = styled('div')(({ theme }) => ({
  position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0,
  background: `radial-gradient(1000px 500px at 15% -10%, ${alpha(theme.palette.pastel.blue,0.6)} 0%, transparent 60%),
               radial-gradient(900px 500px at 110% 30%, ${alpha(theme.palette.pastel.lilac,0.5)} 0%, transparent 65%),
               radial-gradient(900px 600px at 0% 100%, ${alpha(theme.palette.pastel.mint,0.45)} 0%, transparent 55%),
               ${theme.palette.background.default}`,
  pointerEvents: 'none'
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
  width: size, height: size,
  borderRadius: 999,
  background: `linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,255,255,0.4))`,
  boxShadow: `0 0 ${size * 1.4}px rgba(27,31,39,0.08)`,
  animation: `${float} ${6 + (size % 7)}s ease-in-out ${delay}s infinite`,
  opacity: 0.9
}));

const TableShell = styled(TableContainer)(({ theme }) => ({
  animation: `${fadeIn} .5s ease-out`,
  maxWidth: 1480,
  margin: '0 auto'
}));
const HoverRow = styled(TableRow)(({ theme }) => ({
  transition: 'transform .18s ease, background .18s ease',
  '&:hover': {
    background: alpha(theme.palette.pastel.blue, .3),
    animation: `${rowHover} .18s ease forwards`
  }
}));

const PillSearch = styled(TextField)(({ theme }) => ({
  width: 260,
  '& .MuiOutlinedInput-root': {
    borderRadius: 9999,
    background: '#fff',
    boxShadow: '0 2px 10px rgba(15,17,21,0.08)',
    '& fieldset': { borderColor: 'transparent' },
    '&:hover fieldset': { borderColor: alpha(theme.palette.neutral[900],0.08) },
    '&.Mui-focused fieldset': { borderColor: alpha(theme.palette.neutral[900],0.2) }
  }
}));

const StatusChip = ({ value }) => {
  const val = String(value || '').toLowerCase();
  const map = {
    active:  { bg: theme.palette.pastel.mint,  color: theme.palette.neutral[900], label: 'active' },
    expired: { bg: theme.palette.pastel.lilac, color: theme.palette.neutral[900], label: 'expired' },
    pending: { bg: theme.palette.pastel.lemon, color: theme.palette.neutral[900], label: 'pending' },
    rejected:{ bg: theme.palette.pastel.pink,  color: theme.palette.neutral[900], label: 'rejected' },
  };
  const s = map[val] || { bg: theme.palette.neutral[100], color: theme.palette.neutral[900], label: val || 'N/A' };
  return (
    <Chip
      label={s.label}
      sx={{ bgcolor: s.bg, color: s.color, fontWeight: 800, borderRadius: 999, height: 26 }}
      size="small"
    />
  );
};

/* ===================== Component ===================== */
const ManageAds = () => {
  const { handleLogout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // state
  const [ads, setAds] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');

  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [adToDelete, setAdToDelete] = useState(null);

  const [currentAd, setCurrentAd] = useState({
    id: null, title: '', content: '', link: '', status: 'active',
    expiration_date: '', image: '', show_at: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [editStatus, setEditStatus] = useState('active');
  const [adminNotes, setAdminNotes] = useState('');
  const [adminNotesError, setAdminNotesError] = useState('');
  const [showAt, setShowAt] = useState('');

  // drawer handlers
  const handleMenuClick = useCallback(() => setIsDrawerOpen(true), []);
  const handleDrawerClose = useCallback(() => setIsDrawerOpen(false), []);

  const menuItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Manage Advertisements', path: '/manageadd', icon: <AddCircleIcon /> },
    { text: 'Manage Order', path: '/manageorder', icon: <ShoppingCartIcon /> },
    { text: 'Manage User', path: '/manageuser', icon: <PeopleIcon /> },
    { text: 'Manage Post', path: '/managepost', icon: <AssignmentIcon /> },
    { text: 'Report posts', path: '/manage-reported-posts', icon: <ReportProblemIcon /> },
    { text: 'Manage Categories', path: '/managecategories', icon: <CategoryIcon /> },
  ];

  // auth check
  useEffect(() => { if (!isAdmin()) navigate('/login'); }, [isAdmin, navigate]);

  /* -------------------- fetch -------------------- */
  const fetchAds = useCallback(async (query='') => {
    const token = localStorage.getItem('token');
    try {
      const url = query
        ? `${process.env.REACT_APP_BASE_URL}/admin/search/ads?q=${encodeURIComponent(query)}`
        : `${process.env.REACT_APP_BASE_URL}/ads`;
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });

      if (res.data?.message === 'No advertisements found') {
        setAds([]);
      } else if (Array.isArray(res.data)) {
        setAds(res.data);
      } else if (res.data && Array.isArray(res.data.results)) {
        setAds(res.data.results);
      } else {
        setAds([]);
        console.error('Unexpected response format:', res.data);
      }
    } catch (e) {
      setAds([]);
      if (e?.response?.status === 401) { handleLogout(); navigate('/login'); }
    }
  }, [handleLogout, navigate]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setCurrentSearchTerm(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);
  useEffect(() => { fetchAds(currentSearchTerm); }, [currentSearchTerm, fetchAds]);

  /* -------------------- sort + filter -------------------- */
  const sortedAds = useMemo(() => {
    if (!Array.isArray(ads) || ads.length === 0) return [];
    const filtered = ads.filter(ad => {
      const s = String(ad.status || '').toLowerCase();
      return ['active', 'expired', 'pending', 'rejected'].includes(s);
    });
    const order = { active: 1, pending: 2, expired: 3, rejected: 4 };
    return [...filtered].sort((a, b) => {
      const sa = order[String(a.status || '').toLowerCase()] || 99;
      const sb = order[String(b.status || '').toLowerCase()] || 99;
      if (sa !== sb) return sa - sb;
      return new Date(a.created_at) - new Date(b.created_at);
    });
  }, [ads]);

  /* -------------------- CRUD handlers -------------------- */
  const handleAddClick = () => {
    setCurrentAd({ id: null, title: '', content: '', link: '', status: 'active', expiration_date: '', image: '', show_at: '' });
    setEditStatus('active');
    setShowAt('');
    setImageFile(null);
    setAdminNotes('');
    setAdminNotesError('');
    setOpenDialog(true);
  };

  const handleEdit = (ad) => {
    setCurrentAd({
      ...ad,
      expiration_date: ad.expiration_date ? new Date(ad.expiration_date).toISOString().slice(0, 10) : '',
      status: ad.status ? ad.status.toLowerCase() : 'active',
    });
    setEditStatus(ad.status ? ad.status.toLowerCase() : 'active');
    setShowAt(ad.show_at ? new Date(ad.show_at).toISOString().slice(0, 10) : '');
    setAdminNotes('');
    setAdminNotesError('');
    setImageFile(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setImageFile(null);
    fetchAds(currentSearchTerm);
  };

  const handleDeleteClick = (id) => { setAdToDelete(id); setOpenConfirmDelete(true); };
  const handleCancelDelete = () => { setOpenConfirmDelete(false); setAdToDelete(null); };
  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/ads/${adToDelete}`, { headers: { Authorization: `Bearer ${token}` }});
      setOpenConfirmDelete(false);
      setAdToDelete(null);
      fetchAds(currentSearchTerm);
    } catch {
      alert('Failed to delete ad.');
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    setCurrentAd(prev => ({ ...prev, image: '' }));
  };

  const handleSave = async () => {
    // ถ้าเลือก rejected ต้องมีเหตุผล
    if (editStatus === 'rejected' && (!adminNotes || adminNotes.trim() === '')) {
      setAdminNotesError('กรุณากรอกเหตุผลที่ Reject');
      return;
    }
    setAdminNotesError('');

    const token = localStorage.getItem('token');
    const fd = new FormData();
    fd.append('title', currentAd.title || '');
    fd.append('content', currentAd.content || '');
    fd.append('link', currentAd.link || '');
    fd.append('status', editStatus || currentAd.status || 'active');
    fd.append('expiration_date', currentAd.expiration_date || '');
    if (showAt) fd.append('show_at', showAt);
    if (imageFile) {
      fd.append('image', imageFile);
    } else if (currentAd.image === '') {
      fd.append('image_action', 'clear');
    }
    if (editStatus === 'rejected') fd.append('admin_notes', adminNotes);

    try {
      if (currentAd.id) {
        await axios.put(`${process.env.REACT_APP_BASE_URL}/admin/ads/${currentAd.id}`, fd, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/ads`, fd, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
      }
      setOpenDialog(false);
      fetchAds(currentSearchTerm);
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Save failed';
      alert(`Error: ${msg}`);
    }
  };

  if (!isAdmin()) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh' }}>
          <Paper sx={{ p:5, borderRadius:3 }}>
            <Typography variant="h5" gutterBottom>Access Denied</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>You are not authorized to view this page.</Typography>
            <Button variant="contained" onClick={()=>navigate('/login')}>Go to Login</Button>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  /* -------------------- Columns width -------------------- */
  const colSx = {
    id:{ width: 80 }, img:{ width: 130 }, title:{ width: 220 }, content:{ width: 280 },
    link:{ width: 200 }, show:{ width: 130 }, created:{ width: 170 }, updated:{ width: 170 },
    exp:{ width: 160 }, status:{ width: 130 }, actions:{ width: 120 }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Pastel moving background */}
      <Backdrop>
        <Aurora />
        {[{size:6,x:12,y:22,delay:.2},{size:10,x:28,y:66,delay:.4},{size:8,x:70,y:28,delay:.1},{size:12,x:84,y:58,delay:.5},{size:9,x:45,y:40,delay:.3},{size:7,x:60,y:75,delay:.2}]
          .map((p,i)=><Particle key={i} {...p}/>)}
      </Backdrop>

      {/* AppBar */}
      <AppBar position="fixed">
        <Toolbar sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:2 }}>
          {/* Left: menu + title */}
          <Box sx={{ display:'flex', alignItems:'center', gap: 2 }}>
            <IconButton edge="start" color="inherit" onClick={handleMenuClick} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Manage Ads</Typography>
          </Box>

          {/* Right: search + add + logout */}
          <Box sx={{ display:'flex', alignItems:'center', gap: 1.5, ml: 'auto' }}>
            <PillSearch
              size="small"
              placeholder="Search ads..."
              value={searchQuery}
              onChange={(e)=>setSearchQuery(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} /> }}
            />
            <Button
              variant="contained"
              onClick={handleAddClick}
              startIcon={<AddCircleIcon />}
              sx={{ bgcolor:'#fff', color:'neutral.900', '&:hover':{ bgcolor:'neutral.100' } }}
            >
              Add Ad
            </Button>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<ExitToAppIcon />}
              sx={{ bgcolor:'#fff', color:'text.primary', borderRadius: 1, px: 2, '&:hover':{ bgcolor:'neutral.100' } }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer (no white border) */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
        <Box
          sx={{ width: 280, background: 'linear-gradient(180deg, rgba(19,22,29,0.96), rgba(19,22,29,0.92))', color:'#fff', height:'100%' }}
          role="presentation"
          onClick={handleDrawerClose}
        >
          <Box sx={{ p: 2.5 }}>
            <Typography sx={{ fontWeight: 800, letterSpacing: '.06em' }}>MENU</Typography>
          </Box>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.text}
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  mx: 1.2, my: 0.6, borderRadius: 0, color: '#fff',
                  '& .MuiListItemIcon-root': { color: '#fff', minWidth: 36 },
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
      <Box sx={{ position:'relative', zIndex:1, px:{ xs:2, md:4 }, pt:{ xs:12, md:14 }, pb:6, maxWidth:1600, mx:'auto' }}>
        <Box sx={{ textAlign:'center', mb: 5 }}>
          <Typography variant="h2">Manage Advertisements</Typography>
        </Box>

        <TableShell component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={colSx.id}>ID</TableCell>
                <TableCell sx={colSx.img}>Image</TableCell>
                <TableCell sx={colSx.title}>Title</TableCell>
                <TableCell sx={colSx.content}>Content</TableCell>
                <TableCell sx={colSx.link}>Link</TableCell>
                <TableCell sx={colSx.show}>Show At</TableCell>
                <TableCell sx={colSx.created}>Created At</TableCell>
                <TableCell sx={colSx.updated}>Updated At</TableCell>
                <TableCell sx={colSx.exp}>Expiration</TableCell>
                <TableCell sx={colSx.status}>Status</TableCell>
                <TableCell sx={colSx.actions}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedAds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center">No advertisements found.</TableCell>
                </TableRow>
              ) : (
                sortedAds.map((ad) => (
                  <HoverRow key={ad.id}>
                    <TableCell sx={colSx.id}>{ad.id}</TableCell>
                    <TableCell sx={colSx.img}>
                      {ad.image ? (
                        <a
                          href={`${process.env.REACT_APP_BASE_URL}${ad.image}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`${process.env.REACT_APP_BASE_URL}${ad.image}`}
                            alt={ad.title}
                            style={{ width: 90, height: 'auto', borderRadius: 8, cursor: 'pointer' }}
                          />
                        </a>
                      ) : (
                        <Typography variant="body2" color="text.secondary">No Image</Typography>
                      )}
                    </TableCell>

                    <TableCell sx={colSx.title}>{ad.title || '-'}</TableCell>
                    <TableCell sx={colSx.content}>{ad.content || '-'}</TableCell>
                    <TableCell sx={colSx.link}>
                      {ad.link ? <a href={ad.link} target="_blank" rel="noopener noreferrer">{ad.link}</a> : 'N/A'}
                    </TableCell>
                    <TableCell sx={colSx.show}>{ad.show_at ? new Date(ad.show_at).toLocaleDateString('en-GB') : 'N/A'}</TableCell>
                    <TableCell sx={colSx.created}>{new Date(ad.created_at).toLocaleString('en-GB')}</TableCell>
                    <TableCell sx={colSx.updated}>{new Date(ad.updated_at).toLocaleString('en-GB')}</TableCell>
                    <TableCell sx={colSx.exp}>{ad.expiration_date ? new Date(ad.expiration_date).toLocaleString('en-GB') : 'N/A'}</TableCell>
                    <TableCell sx={colSx.status}><StatusChip value={ad.status} /></TableCell>
                    <TableCell sx={colSx.actions}>
                      <IconButton
                        onClick={() => handleEdit(ad)}
                        sx={{ mr: 1, bgcolor: theme.palette.pastel.blue, '&:hover':{ bgcolor: alpha(theme.palette.pastel.blue,.8) } }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(ad.id)}
                        sx={{ bgcolor: theme.palette.pastel.pink, '&:hover':{ bgcolor: alpha(theme.palette.pastel.pink,.85) } }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </HoverRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableShell>
      </Box>

      {/* Dialog: Add/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ sx:{ p: 0.5, minWidth: 520 }}}>
        <DialogTitle sx={{ fontWeight: 800 }}>{currentAd.id ? 'Edit Advertisement' : 'Add New Advertisement'}</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="dense" label="Title" type="text" fullWidth variant="outlined"
            value={currentAd.title || ''} onChange={(e)=>setCurrentAd({ ...currentAd, title: e.target.value })} sx={{ mb: 2 }}
          />
          <TextField
            margin="dense" label="Content" type="text" fullWidth variant="outlined"
            value={currentAd.content || ''} onChange={(e)=>setCurrentAd({ ...currentAd, content: e.target.value })} sx={{ mb: 2 }}
          />
          <TextField
            margin="dense" label="Link" type="text" fullWidth variant="outlined"
            value={currentAd.link || ''} onChange={(e)=>setCurrentAd({ ...currentAd, link: e.target.value })} sx={{ mb: 2 }}
          />

          {/* Upload / Clear */}
          <Box sx={{ display:'flex', alignItems:'center', gap: 1.5, mb: 2 }}>
            <input accept="image/*" style={{ display: 'none' }} id="ad-image-file" type="file" onChange={(e)=>setImageFile(e.target.files[0])} />
            <label htmlFor="ad-image-file">
              <Button variant="outlined" component="span" startIcon={<AddCircleIcon />}>Upload Image</Button>
            </label>
            {(imageFile || currentAd.image) && (
              <Button variant="outlined" color="error" onClick={handleClearImage} startIcon={<CancelIcon />}>Clear Image</Button>
            )}
          </Box>
          {imageFile && <Typography variant="body2" sx={{ mb: 1 }}>Selected: {imageFile.name}</Typography>}
          {(imageFile || currentAd.image) && (
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : `${process.env.REACT_APP_BASE_URL}${currentAd.image}`}
              alt="Ad preview" style={{ maxWidth:'100%', maxHeight:200, objectFit:'contain', marginBottom:16 }}
            />
          )}

          <TextField
            margin="dense" label="Expiration Date" type="date" fullWidth variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={currentAd.expiration_date || ''} onChange={(e)=>setCurrentAd({ ...currentAd, expiration_date: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense" label="Show At" type="date" fullWidth variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={showAt} onChange={(e)=>setShowAt(e.target.value)} sx={{ mb: 2 }}
          />

          {/* Status buttons (ชัดว่าถูกเลือก) */}
          <Box sx={{ mt: 1, mb: 1.5 }}>
            <Typography sx={{ fontWeight: 800, mb: 1 }}>Status</Typography>
            <Box sx={{ display:'flex', gap: 1 }}>
              {['active','rejected'].map(s => {
                const selected = (editStatus || currentAd.status) === s;
                const styleMap = { active:{ bg: theme.palette.pastel.mint }, rejected:{ bg: theme.palette.pastel.pink } };
                return (
                  <Button
                    key={s}
                    onClick={()=>setEditStatus(s)}
                    sx={{
                      borderRadius: 999, px: 2.2, fontWeight: 800,
                      bgcolor: selected ? styleMap[s].bg : theme.palette.neutral[100],
                      color: theme.palette.neutral[900],
                      boxShadow: selected ? '0 6px 16px rgba(0,0,0,0.08)' : 'none',
                      '&:hover': { bgcolor: selected ? styleMap[s].bg : theme.palette.neutral[200] }
                    }}
                  >
                    {s.charAt(0).toUpperCase()+s.slice(1)}
                  </Button>
                );
              })}
            </Box>
          </Box>

          { (editStatus || currentAd.status) === 'rejected' && (
            <TextField
              margin="dense" label="เหตุผลที่ Reject (บันทึกถึงผู้ใช้)" type="text" fullWidth
              value={adminNotes} onChange={(e)=>{ setAdminNotes(e.target.value); setAdminNotesError(''); }}
              error={!!adminNotesError} helperText={adminNotesError} sx={{ mt: 1 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
          <Button onClick={handleSave} variant="contained"> {currentAd.id ? 'Save Changes' : 'Add Advertisement'} </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={openConfirmDelete} onClose={handleCancelDelete}>
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Delete</DialogTitle>
        <DialogContent dividers>
          <Typography>Are you sure you want to delete this advertisement?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ManageAds;
