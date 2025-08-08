import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, ThemeProvider, createTheme,
  Drawer, List, ListItem, ListItemText, FormControl,
  CssBaseline, Chip, Divider, ListItemIcon
} from '@mui/material';
import axios from 'axios';
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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../AuthContext';
import { keyframes } from '@emotion/react';
import { styled, alpha } from '@mui/material/styles';

// ===== Animations =====
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;
const rowHover = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(-2px); }
`;

// ===== Theme (match Dashboard) =====
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

// ===== Styled =====
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

// ===== Animations (extra for aurora) =====
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


// ===== Background (subtle pastel aurora over light gray) =====
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


const StatusChip = ({ value }) => {
  const val = String(value || '').toLowerCase();
  const map = {
    pending: { bg: theme.palette.pastel.lemon, color: theme.palette.neutral[900], label: 'pending' },
    approved:{ bg: theme.palette.pastel.blue,  color: theme.palette.neutral[900], label: 'approved' },
    paid:    { bg: theme.palette.pastel.blue,  color: theme.palette.neutral[900], label: 'paid' },
    active:  { bg: theme.palette.pastel.mint,  color: theme.palette.neutral[900], label: 'active' },
    rejected:{ bg: theme.palette.pastel.pink,  color: theme.palette.neutral[900], label: 'rejected' },
  };
  const s = map[val] || { bg: theme.palette.neutral[100], color: theme.palette.neutral[900], label: val || 'N/A' };
  return (
    <Chip
      label={s.label}
      sx={{
        bgcolor: s.bg,
        color: s.color,
        fontWeight: 800,
        borderRadius: 999,
        height: 26
      }}
      size="small"
    />
  );
};

// ===== ManageOrders =====
const ManageOrders = () => {
  const { handleLogout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [currentOrder, setCurrentOrder] = useState({ id: null, title: '', content: '', link: '', status: 'pending' });
  const [adminNotes, setAdminNotes] = useState('');
  const [adminNotesError, setAdminNotesError] = useState('');
  const [editStatus, setEditStatus] = useState('');

  // drawer handlers (FIX error)
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

  useEffect(() => { if (!isAdmin()) navigate('/login'); }, [isAdmin, navigate]);

  const sortOrders = (orders) => {
    const nonRejected = orders.filter(o => String(o.status).toLowerCase() !== 'rejected')
      .sort((a,b) => new Date(a.updated_at) - new Date(b.updated_at));
    const rejected = orders.filter(o => String(o.status).toLowerCase() === 'rejected')
      .sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at));
    return [...nonRejected, ...rejected];
  };

  const fetchOrders = useCallback(async (query='') => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let filtered = res.data.filter(order =>
        ['pending','paid','rejected','approved','active'].includes(String(order.status).toLowerCase())
      );
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(order =>
          String(order.id).includes(q) ||
          (order.title && order.title.toLowerCase().includes(q)) ||
          (order.content && order.content.toLowerCase().includes(q)) ||
          (order.status && order.status.toLowerCase().includes(q)) ||
          (order.user_id && String(order.user_id).includes(q))
        );
      }
      setOrders(sortOrders(filtered));
    } catch (e) {
      setOrders([]);
      if (e?.response?.status === 401) { handleLogout(); navigate('/login'); }
    }
  }, [handleLogout, navigate]);

  useEffect(() => {
    const h = setTimeout(() => setCurrentSearchTerm(searchQuery), 250);
    return () => clearTimeout(h);
  }, [searchQuery]);

  useEffect(() => { fetchOrders(currentSearchTerm); }, [currentSearchTerm, fetchOrders]);

  const handleEdit = (order) => {
    setCurrentOrder({
      id: order.id,
      title: order.title || '',
      content: order.content || '',
      link: order.link || '',
      status: order.status ? order.status.toLowerCase() : 'pending',
    });
    setEditStatus('');
    setAdminNotes('');
    setAdminNotesError('');
    setOpenDialog(true);
  };

  const handleSave = async () => {
    const finalStatus = editStatus || currentOrder.status;
    const requireNote = finalStatus === 'rejected';
    if (requireNote && (!adminNotes || adminNotes.trim() === '')) {
      setAdminNotesError('กรุณากรอกเหตุผลที่ Reject');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/admin/orders/${currentOrder.id}`,
        { title: currentOrder.title, content: currentOrder.content, link: currentOrder.link, status: finalStatus, admin_notes: requireNote ? adminNotes : undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpenDialog(false);
      fetchOrders(currentSearchTerm);
    } catch {
      alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
    }
  };

  const colSx = {
    id: { width: 90 },
    uid:{ width: 110 },
    title:{ width: 180 },
    content:{ width: 220 },
    link:{ width: 200 },
    img:{ width: 120 },
    slip:{ width: 120 },
    status:{ width: 120 },
    created:{ width: 170 },
    updated:{ width: 170 },
    actions:{ width: 120 }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Pastel moving background */}
      <Backdrop>
        <Aurora />
        {[
          { size: 6,  x: 12, y: 22, delay: .2 },
          { size: 10, x: 28, y: 66, delay: .4 },
          { size: 8,  x: 70, y: 28, delay: .1 },
          { size: 12, x: 84, y: 58, delay: .5 },
          { size: 9,  x: 45, y: 40, delay: .3 },
          { size: 7,  x: 60, y: 75, delay: .2 },
        ].map((p,i) => <Particle key={i} {...p} />)}
      </Backdrop>

      {/* AppBar */}
      <AppBar position="fixed">
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          {/* left: menu + title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton edge="start" color="inherit" onClick={handleMenuClick} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Manage Orders
            </Typography>
          </Box>

          {/* right: search + logout */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
              sx={{
                width: { xs: 180, sm: 240 },     // smaller and right-aligned
                '& .MuiOutlinedInput-root': {
                  borderRadius: '999px',
                  bgcolor: '#fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                },
              }}
            />
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<ExitToAppIcon />}
              sx={{
                bgcolor: '#FFFFFF',
                color: 'text.primary',
                borderRadius: 1,
                px: 2,
                '&:hover': { bgcolor: 'neutral.100' },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
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
      <Box sx={{ position:'relative', zIndex: 1, px:{ xs:2, md:4 }, pt:{ xs:12, md:14 }, pb:6, maxWidth:1600, mx:'auto' }}>

        <Box sx={{ textAlign:'center', mb: 5 }}>
          <Typography variant="h2">Manage Orders</Typography>
        </Box>

        <TableShell component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={colSx.id}>Order ID</TableCell>
                <TableCell sx={colSx.uid}>User ID</TableCell>
                <TableCell sx={colSx.title}>Ad Title</TableCell>
                <TableCell sx={colSx.content}>Ad Content</TableCell>
                <TableCell sx={colSx.link}>Ad Link</TableCell>
                <TableCell sx={colSx.img}>Ad Image</TableCell>
                <TableCell sx={colSx.slip}>Slip Image</TableCell>
                <TableCell sx={colSx.status}>Status</TableCell>
                <TableCell sx={colSx.created}>Created At</TableCell>
                <TableCell sx={colSx.updated}>Updated At</TableCell>
                <TableCell sx={colSx.actions}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center">No orders found.</TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <HoverRow key={order.id}>
                    <TableCell sx={colSx.id}>{order.id}</TableCell>
                    <TableCell sx={colSx.uid}>{order.user_id}</TableCell>
                    <TableCell sx={colSx.title}>{order.title || '-'}</TableCell>
                    <TableCell sx={colSx.content}>{order.content || '-'}</TableCell>
                    <TableCell sx={colSx.link}>
                      {order.link ? <a href={order.link} target="_blank" rel="noopener noreferrer">{order.link}</a> : 'N/A'}
                    </TableCell>
                    <TableCell sx={colSx.img}>
                      {order.image ? (
                        <a href={`${process.env.REACT_APP_BASE_URL}${order.image}`} target="_blank" rel="noopener noreferrer">
                          <img src={`${process.env.REACT_APP_BASE_URL}${order.image}`} alt={order.title}
                               style={{ width: 72, height: 'auto', borderRadius: 8 }} />
                        </a>
                      ) : <Typography variant="body2" color="text.secondary">No Image</Typography>}
                    </TableCell>
                    <TableCell sx={colSx.slip}>
                      {order.slip_image ? (
                        <a href={`${process.env.REACT_APP_BASE_URL}/${String(order.slip_image).replace(/\\/g,'/')}`} target="_blank" rel="noopener noreferrer">
                          <img src={`${process.env.REACT_APP_BASE_URL}/${String(order.slip_image).replace(/\\/g,'/')}`} alt="Slip"
                               style={{ width: 72, height: 'auto', borderRadius: 8 }} />
                        </a>
                      ) : <Typography variant="body2" color="text.secondary">No Slip</Typography>}
                    </TableCell>
                    <TableCell sx={colSx.status}>
                      <StatusChip value={order.status} />
                    </TableCell>
                    <TableCell sx={colSx.created}>{new Date(order.created_at).toLocaleString('en-GB')}</TableCell>
                    <TableCell sx={colSx.updated}>{new Date(order.updated_at).toLocaleString('en-GB')}</TableCell>
                    <TableCell sx={colSx.actions}>
                      <IconButton onClick={() => handleEdit(order)} sx={{ mr: 1, bgcolor: theme.palette.pastel.blue, '&:hover':{ bgcolor: alpha(theme.palette.pastel.blue,.8) }}}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => { setOrderToDelete(order.id); setOpenConfirmDelete(true); }}
                        sx={{ bgcolor: theme.palette.pastel.pink, '&:hover':{ bgcolor: alpha(theme.palette.pastel.pink,.85) }}}>
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

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={()=>setOpenDialog(false)} PaperProps={{ sx:{ p: 0.5, minWidth: 520 }}}>
        <DialogTitle sx={{ fontWeight: 800 }}>แก้ไขออเดอร์</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="dense" label="Title" type="text" fullWidth variant="outlined"
            value={currentOrder.title || ''} onChange={(e)=>setCurrentOrder({...currentOrder, title: e.target.value})} sx={{ mb: 2 }}
          />
          <TextField
            margin="dense" label="Content" type="text" fullWidth variant="outlined"
            value={currentOrder.content || ''} onChange={(e)=>setCurrentOrder({...currentOrder, content: e.target.value})} sx={{ mb: 2 }}
          />
          <TextField
            margin="dense" label="Link" type="text" fullWidth variant="outlined"
            value={currentOrder.link || ''} onChange={(e)=>setCurrentOrder({...currentOrder, link: e.target.value})} sx={{ mb: 2 }}
          />

          {/* Status buttons */}
          <Box sx={{ mt: 1, mb: 1.5 }}>
            <Typography sx={{ fontWeight: 800, mb: 1 }}>Status</Typography>
            <Box sx={{ display:'flex', gap: 1 }}>
              {['active','rejected'].map(s => {
                const selected = (editStatus || currentOrder.status) === s;
                const styleMap = {
                  active: { bg: theme.palette.pastel.mint },
                  rejected: { bg: theme.palette.pastel.pink }
                };
                return (
                  <Button
                    key={s}
                    onClick={()=>setEditStatus(s)}
                    sx={{
                      borderRadius: 999,
                      px: 2.2,
                      fontWeight: 800,
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

          {(editStatus || currentOrder.status) === 'rejected' && (
            <TextField
              margin="dense" label="เหตุผลที่ Reject (บันทึกถึงผู้ใช้)" type="text" fullWidth
              value={adminNotes} onChange={e=>{ setAdminNotes(e.target.value); setAdminNotesError(''); }}
              error={!!adminNotesError} helperText={adminNotesError} sx={{ mt: 1 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenDialog(false)} color="secondary">ยกเลิก</Button>
          <Button onClick={handleSave} variant="contained">บันทึก</Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={openConfirmDelete} onClose={()=>setOpenConfirmDelete(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>ยืนยันการลบ</DialogTitle>
        <DialogContent dividers>
          <Typography>คุณแน่ใจหรือไม่ว่าต้องการลบออเดอร์นี้? การลบนี้จะลบโฆษณาที่เกี่ยวข้องด้วย</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenConfirmDelete(false)}>ยกเลิก</Button>
          <Button color="error" variant="contained" onClick={async ()=>{
            const token = localStorage.getItem('token');
            try {
              await axios.delete(`${process.env.REACT_APP_BASE_URL}/admin/orders/${orderToDelete}`, { headers:{ Authorization:`Bearer ${token}` } });
              setOpenConfirmDelete(false); setOrderToDelete(null); fetchOrders(currentSearchTerm);
            } catch { alert('เกิดข้อผิดพลาดในการลบข้อมูล'); }
          }}>ลบ</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ManageOrders;
