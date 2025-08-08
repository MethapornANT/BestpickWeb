import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Dialog, DialogActions, DialogContent,
  DialogTitle, Drawer, List, ListItem, ListItemText, FormControl,
  InputLabel, Select, MenuItem, CssBaseline, Avatar, TextField, Divider, ListItemIcon, Chip
} from '@mui/material';
import axios from 'axios';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PeopleIcon from '@mui/icons-material/People';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../AuthContext';
import { createTheme, ThemeProvider, styled, alpha } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

// ===== Animations =====
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;
const rowHover = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(-2px); }
`;

// ===== Theme (match dashboard usedก่อนหน้า) =====
const theme = createTheme({
  palette: {
    neutral: {
      900: '#0F1115', 800: '#13161D', 700: '#1B1F27', 600: '#2A2F3A',
      500: '#3A4150', 400: '#6B7280', 300: '#9CA3AF', 200: '#D1D5DB', 100: '#E5E7EB', 50: '#F5F7FB'
    },
    primary: { main: '#1B1F27', contrastText: '#FFFFFF' },
    pastel: { blue: '#DDEEFF', pink: '#FFE6F2', mint: '#E9FFF5', lemon: '#FFF9D9', lilac: '#F1E8FF' },
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
        head: { fontWeight: 800, backgroundColor: '#fff', whiteSpace: 'nowrap' }
      }
    }
  }
});

// ===== Extra BG animations (aurora) =====
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
  filter: 'blur(80px)', mixBlendMode: 'multiply', animation: `${auroraShift} 30s ease-in-out infinite`, opacity: 1
}));
const Particle = styled('span')(({ size = 8, x = 50, y = 50, delay = 0 }) => ({
  position: 'absolute', left: `${x}%`, top: `${y}%`,
  width: size, height: size, borderRadius: 999,
  background: `linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,255,255,0.4))`,
  boxShadow: `0 0 ${size * 1.4}px rgba(27,31,39,0.08)`,
  animation: `${float} ${6 + (size % 7)}s ease-in-out ${delay}s infinite`, opacity: 0.9
}));

// ===== Styled table bits =====
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

const RoleChip = ({ value }) => {
    let bgColor = theme.palette.pastel.lemon;
    let textColor = theme.palette.neutral[900];
    
    if (value?.toLowerCase() === 'admin') {
      bgColor = theme.palette.pastel.pink; // สีชมพู
      textColor = theme.palette.neutral[900];
    }
  
    return (
      <Chip
        label={value || 'N/A'}
        size="small"
        sx={{
          bgcolor: bgColor,
          color: textColor,
          fontWeight: 800,
          borderRadius: 999,
          height: 24
        }}
      />
    );
  };
  

const ManageUsers = () => {
  const { handleLogout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');

  const handleMenuClick = useCallback(() => setDrawerOpen(true), []);
  const handleDrawerClose = useCallback(() => setDrawerOpen(false), []);

  const fetchUsers = useCallback(async (query='') => {
    const token = localStorage.getItem('token');
    try {
      const url = query
        ? `${process.env.REACT_APP_BASE_URL}/admin/search/users?q=${encodeURIComponent(query)}`
        : `${process.env.REACT_APP_BASE_URL}/admin/users`;
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` }});
      if (Array.isArray(res.data)) {
        setUsers(res.data.sort((a, b) => {
          if (a.role?.toLowerCase() === 'admin' && b.role?.toLowerCase() !== 'admin') return -1;
          if (a.role?.toLowerCase() !== 'admin' && b.role?.toLowerCase() === 'admin') return 1;
          return 0;
        }));
      }
      else if (Array.isArray(res.data?.results)) {
        setUsers(res.data.results.sort((a, b) => {
          if (a.role?.toLowerCase() === 'admin' && b.role?.toLowerCase() !== 'admin') return -1;
          if (a.role?.toLowerCase() !== 'admin' && b.role?.toLowerCase() === 'admin') return 1;
          return 0;
        }));
      }
      else {
        setUsers([]);
        console.error('Unexpected response format:', res.data);
      }
    }       catch (err) {
      setUsers([]);
      if (err?.response?.status === 401) { handleLogout(); navigate('/login'); }
    }
  }, [handleLogout, navigate]);

  useEffect(() => { if (!isAdmin()) navigate('/login'); else fetchUsers(); }, [isAdmin, navigate, fetchUsers]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setCurrentSearchTerm(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);
  useEffect(() => { fetchUsers(currentSearchTerm); }, [currentSearchTerm, fetchUsers]);

  // edit dialog actions
  const handleOpenEdit = (user) => { setSelectedUser(user); setOpenEditDialog(true); };
  const handleCloseEditDialog = () => { setOpenEditDialog(false); setSelectedUser(null); };

  // delete confirm
  const handleOpenConfirmDelete = (user) => { setSelectedUser(user); setOpenConfirmDeleteDialog(true); };
  const handleCloseConfirmDeleteDialog = () => { setOpenConfirmDeleteDialog(false); setSelectedUser(null); };

  const confirmDeleteUser = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/admin/users/${selectedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter(u => u.id !== selectedUser.id));
      handleCloseConfirmDeleteDialog();
    } catch (e) {
      if (e?.response?.status === 401) { handleLogout(); navigate('/login'); }
      alert('Failed to delete user. Please try again.');
      handleCloseConfirmDeleteDialog();
    }
  };

  const handleSaveUser = async () => {
    const token = localStorage.getItem('token');
    try {
      if (selectedUser?.id) {
        await axios.put(`${process.env.REACT_APP_BASE_URL}/admin/users/${selectedUser.id}/status`,
          { status: selectedUser.status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers((prev) => prev.map(u => u.id === selectedUser.id ? { ...u, status: selectedUser.status } : u));
      }
      setOpenEditDialog(false);
    } catch (e) {
      if (e?.response?.status === 401) { handleLogout(); navigate('/login'); }
    }
  };

  // columns width
  const colSx = {
    avatar: { width: 90 },
    id: { width: 90 },
    email: { width: 220 },
    username: { width: 160 },
    birthday: { width: 140 },
    gender: { width: 90 },
    age: { width: 80 },
    role: { width: 120 },
    status: { width: 120 },
    actions: { width: 120 }
  };

  if (!isAdmin()) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* pastel moving background */}
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

      {/* AppBar with search on the right */}
      <AppBar position="fixed">
        <Toolbar sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:2 }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
            <IconButton edge="start" color="inherit" onClick={handleMenuClick} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Manage Users</Typography>
          </Box>

          <Box sx={{ display:'flex', alignItems:'center', gap:2, ml:'auto' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e)=>setSearchQuery(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} /> }}
              sx={{
                width: { xs: 180, sm: 260 },
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
              sx={{ bgcolor:'#fff', color:'text.primary', borderRadius:1, px:2, '&:hover':{ bgcolor:'neutral.100' } }}
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
          role="presentation" onClick={handleDrawerClose}
        >
          <Box sx={{ p: 2.5 }}>
            <Typography sx={{ fontWeight: 800, letterSpacing: '.06em' }}>MENU</Typography>
          </Box>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
          <List>
            {[
              { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
              { text: 'Manage Advertisements', path: '/manageadd', icon: <AddCircleIcon /> },
              { text: 'Manage Order', path: '/manageorder', icon: <ShoppingCartIcon /> },
              { text: 'Manage User', path: '/manageuser', icon: <PeopleIcon /> },
              { text: 'Manage Post', path: '/managepost', icon: <AssignmentIcon /> },
              { text: 'Report posts', path: '/manage-reported-posts', icon: <ReportProblemIcon /> },
              { text: 'Manage Categories', path: '/managecategories', icon: <CategoryIcon /> },
            ].map(item => (
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
          <Typography variant="h2">Manage Users</Typography>
        </Box>

        <TableShell component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={colSx.avatar}>Avatar</TableCell>
                <TableCell sx={colSx.id}>ID</TableCell>
                <TableCell sx={colSx.email}>Email</TableCell>
                <TableCell sx={colSx.username}>Username</TableCell>
                <TableCell sx={colSx.birthday}>Birthday</TableCell>
                <TableCell sx={colSx.gender}>Gender</TableCell>
                <TableCell sx={colSx.age}>Age</TableCell>
                <TableCell sx={colSx.role}>Role</TableCell>
                <TableCell sx={colSx.status}>Status</TableCell>
                <TableCell sx={colSx.actions}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.length === 0 ? (
                <TableRow><TableCell colSpan={10} align="center">No users found.</TableCell></TableRow>
              ) : (
                users.map(user => (
                  <HoverRow key={user.id}>
                    <TableCell sx={colSx.avatar}>
                      <Box sx={{ display:'flex', justifyContent:'center' }}>
                        {/* >>> Avatar clickable to open full image in a new tab <<< */}
                        {user.picture ? (
                          <a
                            href={`${process.env.REACT_APP_BASE_URL}${user.picture}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open full-size avatar"
                            style={{ lineHeight: 0, borderRadius: '50%' }}
                          >
                            <Avatar
                              src={`${process.env.REACT_APP_BASE_URL}${user.picture}`}
                              alt={`Avatar of ${user.username}`}
                              sx={{ width: 50, height: 50, cursor: 'pointer' }}
                            />
                          </a>
                        ) : (
                          <Avatar sx={{ width: 50, height: 50 }}>
                            {user.username ? user.username[0].toUpperCase() : 'U'}
                          </Avatar>
                        )}
                      </Box>
                    </TableCell>

                    <TableCell sx={{ color:'text.secondary' }}>{user.id}</TableCell>
                    <TableCell sx={{ color:'text.secondary' }}>{user.email}</TableCell>
                    <TableCell sx={{ color:'text.secondary' }}>{user.username}</TableCell>
                    <TableCell sx={{ color:'text.secondary' }}>
                      {user.birthday ? new Date(user.birthday).toLocaleDateString('en-GB') : '-'}
                    </TableCell>
                    <TableCell sx={{ color:'text.secondary' }}>{user.gender || '-'}</TableCell>
                    <TableCell sx={{ color:'text.secondary' }}>{user.age ?? '-'}</TableCell>
                    <TableCell sx={{ color:'text.secondary' }}>
                      <RoleChip value={user.role} />
                    </TableCell>
                    <TableCell sx={{ color:'text.secondary' }}>{user.status}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenEdit(user)} sx={{ mr: 1, bgcolor: theme.palette.pastel.blue, '&:hover':{ bgcolor: alpha(theme.palette.pastel.blue,.85) } }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleOpenConfirmDelete(user)} sx={{ bgcolor: theme.palette.pastel.pink, '&:hover':{ bgcolor: alpha(theme.palette.pastel.pink,.85) } }}>
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
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} PaperProps={{ sx:{ p: 0.5, minWidth: 480 }}}>
        <DialogTitle sx={{ fontWeight: 800 }}>Edit User</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth margin="dense" sx={{ mt: 1.5 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              label="Status"
              value={selectedUser?.status || ''}
              onChange={(e)=>setSelectedUser({ ...selectedUser, status: e.target.value })}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="deactivated">Deactivated</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="secondary">Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={openConfirmDeleteDialog} onClose={handleCloseConfirmDeleteDialog} PaperProps={{ sx:{ minWidth: 460 }}}>
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Deletion</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to soft delete user "{selectedUser?.username}" (ID: {selectedUser?.id})?
            This will also hard delete all their posts and follows. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDeleteDialog}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDeleteUser}>Confirm Delete</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ManageUsers;
