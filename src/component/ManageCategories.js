// src/pages/ManageCategories.jsx — matched to ManageReportedPosts layout/theme, no overflow
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import {
  AppBar, Toolbar, Typography, Button, Box, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, CssBaseline, Drawer, List, ListItem, ListItemText,
  ListItemIcon, Divider, Tooltip
} from '@mui/material';

import { ThemeProvider, createTheme, styled, alpha } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

import MenuIcon from '@mui/icons-material/Menu';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CategoryIcon from '@mui/icons-material/Category';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
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

/* ---------------- Theme (same as ManageReportedPosts) ---------------- */
const theme = createTheme({
  palette: {
    neutral: {
      900: '#0F1115', 800: '#13161D', 700: '#1B1F27', 600: '#2A2F3A',
      500: '#3A4150', 400: '#6B7280', 300: '#9CA3AF', 200: '#D1D5DB',
      100: '#E5E7EB', 50: '#F5F7FB'
    },
    pastel: { blue: '#DDEEFF', pink: '#FFE6F2', mint: '#E9FFF5', lemon: '#FFF9D9', lilac: '#F1E8FF' },
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
    MuiAppBar: { styleOverrides: { root: {
      background: 'rgba(19,22,29,0.88)', backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 12px 28px rgba(15,17,21,0.18)', borderRadius: 0
    } } },
    MuiTableCell: { styleOverrides: { head: { fontWeight: 800, backgroundColor: '#fff', whiteSpace: 'nowrap' } } }
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
  filter: 'blur(80px)', mixBlendMode: 'multiply', animation: `${auroraShift} 30s ease-in-out infinite`, opacity: 1
}));
const Particle = styled('span')(({ size = 8, x = 50, y = 50, delay = 0 }) => ({
  position: 'absolute', left: `${x}%`, top: `${y}%`, width: size, height: size, borderRadius: 999,
  background: `linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,255,255,0.4))`,
  boxShadow: `0 0 ${size * 1.4}px rgba(27,31,39,0.08)`,
  animation: `${float} ${6 + (size % 7)}s ease-in-out ${delay}s infinite`, opacity: 0.9
}));

/* ---------------- Reusable UI ---------------- */
const TableShell = styled(TableContainer)(({ theme }) => ({
  animation: `${fadeIn} .5s ease-out`,
  width: '100%', maxWidth: '100%', margin: 0,
  overflowX: 'hidden', // prevent horizontal scroll; cells will ellipsize
  boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
}));
const HoverRow = styled(TableRow)(({ theme }) => ({
  transition: 'transform .18s ease, background .18s ease',
  '&:hover': { background: alpha(theme.palette.pastel.blue, .28) }
}));
const PastelIconBtn = ({ color = 'blue', children, ...props }) => (
  <IconButton
    {...props}
    sx={{ width: 34, height: 34, bgcolor: theme.palette.pastel[color], '&:hover': { bgcolor: alpha(theme.palette.pastel[color], .85) } }}
  >{children}</IconButton>
);
const oneLine = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' };

/* ---------------- Component ---------------- */
const ManageCategories = () => {
  const { handleLogout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');

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

  const fetchCategories = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/categories`, { headers:{ Authorization:`Bearer ${token}` } });
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setCategories([]);
      if (e?.response?.status === 401) { handleLogout(); navigate('/login'); }
    }
  }, [handleLogout, navigate]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  useEffect(() => {
    const h = setTimeout(()=> setCurrentSearchTerm(searchQuery.trim()), 250);
    return () => clearTimeout(h);
  }, [searchQuery]);

  const filtered = useMemo(() => {
    if (!currentSearchTerm) return categories;
    const q = currentSearchTerm.toLowerCase();
    return categories.filter(c => String(c.CategoryName || '').toLowerCase().includes(q) || String(c.CategoryID || '').includes(q));
  }, [categories, currentSearchTerm]);

  // Responsive, clamped column widths to avoid overflow
  const col = {
    id: 'clamp(110px, 14vw, 160px)',
    name: 'clamp(220px, 40vw, 520px)',
    actions: 'clamp(120px, 12vw, 160px)'
  };

  const handleOpenDialog = (category = null) => {
    setSelectedCategory(category);
    setCategoryName(category ? category.CategoryName : '');
    setOpenDialog(true);
  };
  const handleCloseDialog = () => { setOpenDialog(false); setSelectedCategory(null); setCategoryName(''); };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      if (selectedCategory) {
        await axios.put(`${process.env.REACT_APP_BASE_URL}/categories/${selectedCategory.CategoryID}`, { CategoryName: categoryName }, { headers:{ Authorization:`Bearer ${token}`, 'Content-Type':'application/json' } });
        setCategories(prev => prev.map(cat => (cat.CategoryID === selectedCategory.CategoryID ? { ...cat, CategoryName: categoryName } : cat)));
      } else {
        const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/categories`, { CategoryName: categoryName }, { headers:{ Authorization:`Bearer ${token}`, 'Content-Type':'application/json' } });
        setCategories(prev => [...prev, { CategoryID: res.data?.categoryId, CategoryName: categoryName }]);
      }
      handleCloseDialog();
    } catch (e) {
      if (e?.response?.status === 401) { handleLogout(); navigate('/login'); }
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/categories/${id}`, { headers:{ Authorization:`Bearer ${token}` } });
      setCategories(prev => prev.filter(cat => cat.CategoryID !== id));
    } catch (e) {
      if (e?.response?.status === 401) { handleLogout(); navigate('/login'); }
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
            <Typography variant="h6" sx={{ fontWeight:800 }}>Manage Categories</Typography>
          </Box>

          <Box sx={{ display:'flex', alignItems:'center', gap:2, ml:'auto' }}>
            <TextField
              variant="outlined" size="small" placeholder="Search categories..."
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
        <Box sx={{ width:280, background:'linear-gradient(180deg, rgba(19,22,29,0.96), rgba(19,22,29,0.92))', color:'#fff', height:'100%' }} role="presentation" onClick={()=>setIsDrawerOpen(false)}>
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
      <Box sx={{ position:'relative', zIndex:1, px:{ xs:2, md:4 }, pt:{ xs:12, md:14 }, pb:6, maxWidth:1600, mx:'auto' }}>
        <Box sx={{ textAlign:'center', mb:3 }}>
          <Typography variant="h2">Categories</Typography>
        </Box>

        <Box sx={{ display:'flex', justifyContent:'flex-end', mb:2, gap:1.5 }}>
          <Button variant="contained" startIcon={<AddCircleIcon />} onClick={()=>handleOpenDialog()}>Add Category</Button>
        </Box>

        <TableShell component={Paper}>
          <Table stickyHeader sx={{ tableLayout:'fixed', width:'100%' }}>
            <colgroup>
              <col style={{ width: col.id }} />
              <col style={{ width: col.name }} />
              <col style={{ width: col.actions }} />
            </colgroup>

            <TableHead>
              <TableRow>
                <TableCell>Category ID</TableCell>
                <TableCell>Category Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={3} align="center">No categories found.</TableCell></TableRow>
              ) : filtered.map((c) => (
                <HoverRow key={c.CategoryID}>
                  <TableCell><span style={oneLine}>{c.CategoryID}</span></TableCell>
                  <TableCell>
                    <Tooltip title={c.CategoryName || ''} arrow>
                      <span style={oneLine}>{c.CategoryName}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <PastelIconBtn color="blue" onClick={()=>handleOpenDialog(c)}><EditIcon /></PastelIconBtn>
                    <IconButton onClick={()=>handleDelete(c.CategoryID)} sx={{ ml:0.5, width:34, height:34, bgcolor: theme.palette.pastel.pink, '&:hover':{ bgcolor: alpha(theme.palette.pastel.pink,.85) } }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </HoverRow>
              ))}
            </TableBody>
          </Table>
        </TableShell>
      </Box>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ sx:{ p:0.5, minWidth:360 }}}>
        <DialogTitle sx={{ fontWeight:800 }}>{selectedCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent dividers>
          <TextField fullWidth autoFocus margin="dense" label="Category Name" value={categoryName} onChange={(e)=>setCategoryName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ManageCategories;
