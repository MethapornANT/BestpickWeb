import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, ThemeProvider, createTheme,
  Drawer, List, ListItem, ListItemText, FormControl,
  InputLabel, Select, MenuItem, CssBaseline
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
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../AuthContext';
import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';

// --- Keyframes for Animations ---
const backgroundGradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideInUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const bubbleMovement = keyframes`
  0% { transform: translate(0, 0); opacity: 0.1; }
  25% { transform: translate(20vw, 15vh); opacity: 0.15; }
  50% { transform: translate(-10vw, 30vh); opacity: 0.1; }
  75% { transform: translate(15vw, 40vh); opacity: 0.12; }
  100% { transform: translate(0, 0); opacity: 0.1; }
`;

// --- Custom Theme Configuration ---
const theme = createTheme({
  palette: {
    primary: {
      main: '#1A1A1A',
      light: '#333333',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    chartBlue: {
      main: '#9AC7E7',
      light: '#BDE3FF',
      dark: '#6D9BCD',
      contrastText: '#1A1A1A',
    },
    chartPink: {
      main: '#E79ACB',
      light: '#FFBEE3',
      dark: '#CD6D9B',
      contrastText: '#1A1A1A',
    },
    pastelBlue: {
      main: '#C0E0F0',
      light: '#D0EFFC',
      dark: '#9AC6DA',
      contrastText: '#1A1A1A',
    },
    pastelPink: {
      main: '#F0C0E0',
      light: '#FFD0EF',
      dark: '#DA9ACB',
      contrastText: '#1A1A1A',
    },
    background: {
      default: '#E0E0E0',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#BDBDBD',
    },
    divider: '#E0E0E0',
    edit: {
      main: '#C0E0F0',
      light: '#D0EFFC',
      dark: '#9AC6DA',
      contrastText: '#1A1A1A',
    },
    delete: {
      main: '#F0C0E0',
      light: '#FFD0EF',
      dark: '#DA9ACB',
      contrastText: '#1A1A1A',
    },
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#F44336',
      light: '#E57373',
      dark: '#D32F2F',
      contrastText: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: ['"Inter"', 'sans-serif'].join(','),
    h3: {
      fontWeight: 700,
      fontSize: '3.5rem',
      '@media (max-width:960px)': {
        fontSize: '2.8rem',
      },
      '@media (max-width:600px)': {
        fontSize: '2.2rem',
      },
    },
    h4: {
      fontWeight: 600,
      fontSize: '2.2rem',
      '@media (max-width:960px)': {
        fontSize: '1.8rem',
      },
      '@media (max-width:600px)': {
        fontSize: '1.4rem',
      },
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      '@media (max-width:600px)': {
        fontSize: '1.2rem',
      },
    },
    h6: {
      fontWeight: 500,
      color: '#FFFFFF',
      fontSize: '1.05rem',
    },
    body1: {
      fontSize: '0.9rem',
      lineHeight: 1.5,
      color: '#424242',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          minHeight: '48px',
          '@media (min-width:600px)': {
            minHeight: '56px',
          },
          borderRadius: 0,
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          padding: '0 18px',
          '@media (min-width:600px)': {
            paddingLeft: '22px',
            paddingRight: '22px',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          width: 250,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          height: '100%',
          boxShadow: '4px 0 8px rgba(0,0,0,0.15)',
          borderRight: 'none',
          borderRadius: 0,
        }),
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.contrastText,
          padding: '10px 15px',
          margin: '3px 0px',
          borderRadius: '4px',
          transition: 'background-color 0.2s ease, transform 0.2s ease, color 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.08)',
            color: '#FFFFFF',
            transform: 'translateX(3px)',
            boxShadow: 'none',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: '#FFFFFF',
            fontWeight: 600,
            '& .MuiSvgIcon-root': {
              color: '#FFFFFF',
            }
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(255,255,255,0.25)',
          }
        }),
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: ({ theme }) => ({
          minWidth: '35px',
          color: theme.palette.primary.contrastText,
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          boxShadow: '0 6px 15px rgba(0,0,0,0.05)',
          padding: '22px',
          '@media (max-width:600px)': {
            padding: '16px',
            borderRadius: '8px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '5px',
          padding: '8px 14px',
          fontSize: '0.85rem',
          fontWeight: 500,
          transition: 'transform 0.15s ease-out, background-color 0.15s ease-out, box-shadow 0.15s ease-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          },
        },
        containedPrimary: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
            boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
          },
        }),
        containedSecondary: ({ theme }) => ({
          backgroundColor: theme.palette.text.secondary,
          color: theme.palette.primary.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.text.primary,
          },
        }),
        outlinedPrimary: ({ theme }) => ({
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
            borderColor: theme.palette.primary.light,
          },
        }),
        containedError: ({ theme }) => ({
          backgroundColor: theme.palette.error.main,
          color: theme.palette.error.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.error.dark,
            boxShadow: '0 6px 12px rgba(244, 67, 54, 0.2)',
          },
        }),
        textPrimary: ({ theme }) => ({
          color: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.02)',
            color: theme.palette.primary.main,
          }
        })
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          color: theme.palette.text.secondary,
          borderRadius: '50%',
          padding: '8px',
          transition: 'background-color 0.2s ease, transform 0.15s ease-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            backgroundColor: 'rgba(0,0,0,0.05)',
          },

          ...(ownerState.color === 'edit' && {
            backgroundColor: theme.palette.pastelBlue.main,
            color: theme.palette.pastelBlue.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.pastelBlue.dark,
              color: theme.palette.pastelBlue.contrastText,
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(192, 224, 240, 0.4)',
            },
          }),
          ...(ownerState.color === 'delete' && {
            backgroundColor: theme.palette.pastelPink.main,
            color: theme.palette.pastelPink.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.pastelPink.dark,
              color: theme.palette.pastelPink.contrastText,
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(240, 192, 224, 0.4)',
            },
          }),
        })
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& label.Mui-focused': {
            color: theme.palette.primary.main,
          },
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main,
            },
          },
        }),
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(224, 224, 224, 1)',
          padding: '12px 16px',
        },
        head: {
          fontWeight: 'bold',
          backgroundColor: '#f5f5f5',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td': {
            borderBottom: 0,
          },
        },
      },
    },
  },
});

// --- Styled Components for Animations ---
const AnimatedBackground = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  zIndex: -1,
  background: `linear-gradient(135deg, ${theme.palette.pastelBlue.main} 0%, ${theme.palette.background.default} 25%, ${theme.palette.background.default} 75%, ${theme.palette.pastelPink.main} 100%)`,
  backgroundSize: '400% 400%',
  animation: `${backgroundGradientShift} 35s ease infinite`,
  filter: 'brightness(1.02)',
}));

const Bubble = styled(Box)(({ theme, index }) => ({
  position: 'absolute',
  borderRadius: '50%',
  opacity: 0.1,
  zIndex: -1,
  filter: 'blur(8px)',
  animation: `${bubbleMovement} ${20 + index * 5}s linear infinite ${index * 2}s`,
  width: `${100 + index * 50}px`,
  height: `${100 + index * 50}px`,
  top: `${Math.random() * 80}vh`,
  left: `${Math.random() * 80}vw`,
  backgroundColor: index % 2 === 0 ? theme.palette.pastelBlue.main : theme.palette.pastelPink.main,
}));

const AnimatedPaper = styled(Paper)(({ theme }) => ({
  animation: `${slideInUp} 0.6s ease-out forwards`,
  animationDelay: '0.2s',
  transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 25px rgba(0,0,0,0.15)',
  },
}));

// --- ManageOrders Component ---
const ManageOrders = () => {
  const { handleLogout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // State variables
  const [orders, setOrders] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [currentOrder, setCurrentOrder] = useState({
    id: null,
    title: '',
    content: '',
    link: '',
    status: 'pending',
  });
  const [adminNotes, setAdminNotes] = useState('');
  const [showAdminNotes, setShowAdminNotes] = useState(false);
  const [adminNotesError, setAdminNotesError] = useState('');
  const [editStatus, setEditStatus] = useState('');

  // Menu items for the drawer navigation
  const menuItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Manage Advertisements', path: '/manageadd', icon: <AddCircleIcon /> },
    { text: 'Manage Order', path: '/manageorder', icon: <ShoppingCartIcon /> },
    { text: 'Manage User', path: '/manageuser', icon: <PeopleIcon /> },
    { text: 'Manage Post', path: '/managepost', icon: <AssignmentIcon /> },
    { text: 'Report posts', path: '/manage-reported-posts', icon: <ReportProblemIcon /> },
    { text: 'Manage Categories', path: '/managecategories', icon: <CategoryIcon /> },
  ];

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  const handleMenuClick = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  // ฟังก์ชันจัดเรียงออเดอร์ตามเงื่อนไขใหม่
  const sortOrders = (orders) => {
    // แบ่งกลุ่มออเดอร์
    const nonRejectedOrders = orders.filter(order => String(order.status).toLowerCase() !== 'rejected');
    const rejectedOrders = orders.filter(order => String(order.status).toLowerCase() === 'rejected');
  
    // เรียงลำดับกลุ่ม non-rejected: เก่าไปใหม่
    nonRejectedOrders.sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at));
  
    // เรียงลำดับกลุ่ม rejected: ใหม่ไปเก่า
    rejectedOrders.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  
    // รวมออเดอร์เข้าด้วยกัน
    return [...nonRejectedOrders, ...rejectedOrders];
  };

  // ดึงข้อมูล orders จาก API
  const fetchOrders = useCallback(async (query = '') => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let filtered = response.data.filter(order => {
        const status = order.status ? String(order.status).toLowerCase() : '';
        return status === 'pending' || status === 'paid' || status === 'rejected';
      });
      // filter ด้วย searchQuery ถ้ามี
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
      
      // เรียงลำดับด้วยฟังก์ชัน sortOrders
      const sortedOrders = sortOrders(filtered);
      setOrders(sortedOrders);

    } catch (error) {
      setOrders([]);
      if (error.response && error.response.status === 401) {
        handleLogout();
        navigate('/login');
      }
    }
  }, [handleLogout, navigate]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentSearchTerm(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    fetchOrders(currentSearchTerm);
  }, [currentSearchTerm, fetchOrders]);

  // เปิด dialog แก้ไข order
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
    setShowAdminNotes(false);
    setOpenDialog(true);
  };

  // ปิด dialog แก้ไข
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentOrder({ id: null, title: '', content: '', link: '', status: 'pending' });
  };

  // handle status change
  const handleStatusChange = (e) => {
    const value = e.target.value;
    setEditStatus(value);
    if (value === 'rejected') {
      setShowAdminNotes(true);
    } else {
      setShowAdminNotes(false);
      setAdminNotes('');
    }
  };

  // บันทึกการแก้ไข order
  const handleSave = async () => {
    if (showAdminNotes && (!adminNotes || adminNotes.trim() === '')) {
      setAdminNotesError('กรุณากรอกเหตุผลที่ Reject');
      return;
    }
    setAdminNotesError('');
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/admin/orders/${currentOrder.id}`,
        {
          title: currentOrder.title,
          content: currentOrder.content,
          link: currentOrder.link,
          status: editStatus, // ใช้ค่าที่ admin เลือก
          admin_notes: showAdminNotes ? adminNotes : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOpenDialog(false);
      fetchOrders(currentSearchTerm);
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
    }
  };

  // เปิด dialog ยืนยันลบ
  const handleDeleteClick = (orderId) => {
    setOrderToDelete(orderId);
    setOpenConfirmDelete(true);
  };

  // ปิด dialog ยืนยันลบ
  const handleCancelDelete = () => {
    setOpenConfirmDelete(false);
    setOrderToDelete(null);
  };

  // ลบ order
  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/admin/orders/${orderToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOpenConfirmDelete(false);
      setOrderToDelete(null);
      fetchOrders(currentSearchTerm);
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  if (!isAdmin()) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          textAlign: 'center',
          p: 3
        }}>
          <Paper elevation={3} sx={{ p: 5, borderRadius: '20px' }}>
            <Typography variant="h5" gutterBottom>Access Denied</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              You are not authorized to view this page. Please log in with administrator credentials.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  // กำหนด options ตาม status เดิมของ order (currentOrder.status)
  let statusOptions = [];
  if (currentOrder.status === 'pending') {
    statusOptions = [
      { value: 'approved', label: 'Approved' },
      { value: 'rejected', label: 'Rejected' }
    ];
  } else if (currentOrder.status === 'paid') {
    statusOptions = [
      { value: 'active', label: 'Active' },
      { value: 'rejected', label: 'Rejected' }
    ];
  }
  // ถ้า editStatus ยังไม่ถูกเลือก ให้ default เป็นค่าว่าง ('')
  const selectValue = editStatus || '';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AnimatedBackground>
        {[...Array(5)].map((_, i) => (
          <Bubble key={i} index={i} />
        ))}
      </AnimatedBackground>
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'transparent' }}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleMenuClick}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1}}>
              Manage Orders
            </Typography>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<ExitToAppIcon />}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
          <Box
            sx={{
              width: 250,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              height: '100%'
            }}
            role="presentation"
            onClick={handleDrawerClose}
            onKeyDown={handleDrawerClose}
          >
            <Typography variant="h6" sx={{ padding: '16px', textAlign: 'center', fontWeight: 'bold' }}>
              Menu
            </Typography>
            <List>
              {menuItems.map((item) => (
                <ListItem
                  key={item.text}
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{ color: theme.palette.primary.contrastText }}
                >
                  {item.icon && React.cloneElement(item.icon, { sx: { mr: 1 } })}
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 4,
            width: '100%',
            marginTop: '56px',
            paddingTop: '120px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{
              maxWidth: '1200px',
              width: '100%',
              mx: 'auto',
              p: { xs: 1, md: 0 },
          }}>
            <Typography
                variant="h3"
                align="center"
                gutterBottom
                sx={{
                    color: theme.palette.text.primary,
                    mb: 10,
                    animation: `${fadeIn} 0.8s ease-out forwards`,
                    animationDelay: '0.2s',
                }}
            >
                Manage Orders
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search orders (ID, title, content, status...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />, 
                    }}
                    sx={{ width: { xs: '100%', sm: 'auto' }, mb: { xs: 2, sm: 0 }, flexGrow: 1, mr: { sm: 2 } }}
                />
            </Box>
            <TableContainer component={AnimatedPaper} sx={{ animation: `${fadeIn} 0.8s ease-out forwards`, animationDelay: '0.3s' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>User ID</TableCell>
                    <TableCell>Ad Title</TableCell>
                    <TableCell>Ad Content</TableCell>
                    <TableCell>Ad Link</TableCell>
                    <TableCell>Ad Image</TableCell>
                    {/* New column for Slip Image */}
                    <TableCell>Slip Image</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Updated At</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      {/* Updated colSpan to 11 to account for the new column */}
                      <TableCell colSpan={11} align="center">
                        No orders found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.user_id}</TableCell>
                        <TableCell>{order.title || '-'}</TableCell>
                        <TableCell>{order.content || '-'}</TableCell>
                        <TableCell>
                          {order.link ? (
                            <a href={order.link} target="_blank" rel="noopener noreferrer">{order.link}</a>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          {order.image ? (
                            <a href={`${process.env.REACT_APP_BASE_URL}${order.image}`} target="_blank" rel="noopener noreferrer">
                              <img
                                src={`${process.env.REACT_APP_BASE_URL}${order.image}`}
                                alt={order.title}
                                style={{ width: '80px', height: 'auto', borderRadius: '5px' }}
                              />
                            </a>
                          ) : (
                            <Typography variant="body2" color="text.secondary">No Image</Typography>
                          )}
                        </TableCell>
                        {/* Cell to display the slip_image */}
                        <TableCell>
                          {order.slip_image ? (
                            // แก้ไขตรงนี้
                            <a href={`${process.env.REACT_APP_BASE_URL}/${order.slip_image.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer">
                              <img
                                src={`${process.env.REACT_APP_BASE_URL}/${order.slip_image.replace(/\\/g, '/')}`}
                                alt="Slip"
                                style={{ width: '80px', height: 'auto', borderRadius: '5px' }}
                              />
                            </a>
                          ) : (
                            <Typography variant="body2" color="text.secondary">No Slip</Typography>
                          )}
                        </TableCell>
                        <TableCell>{order.status ? String(order.status).toLowerCase() : 'N/A'}</TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleString('en-GB')}</TableCell>
                        <TableCell>{new Date(order.updated_at).toLocaleString('en-GB')}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEdit(order)} color="edit" sx={{ mr: 1 }}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteClick(order.id)} color="delete">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Dialog สำหรับแก้ไข order */}
            <Dialog open={openDialog} onClose={handleCloseDialog} PaperComponent={AnimatedPaper} PaperProps={{ sx: { animationDelay: '0s', '&:hover': { transform: 'none', boxShadow: '0 6px 15px rgba(0,0,0,0.05)' } } }}>
              <DialogTitle>แก้ไขออเดอร์</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Title"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={currentOrder.title || ''}
                  onChange={(e) => setCurrentOrder({ ...currentOrder, title: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Content"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={currentOrder.content || ''}
                  onChange={(e) => setCurrentOrder({ ...currentOrder, content: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Link"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={currentOrder.link || ''}
                  onChange={(e) => setCurrentOrder({ ...currentOrder, link: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectValue}
                    onChange={handleStatusChange}
                    label="Status"
                  >
                    {statusOptions.map(opt => (
                      <MenuItem value={opt.value} key={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {showAdminNotes && (
                  <TextField
                    margin="dense"
                    label="เหตุผลที่ Reject (บันทึกถึงผู้ใช้)"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={adminNotes}
                    onChange={e => { setAdminNotes(e.target.value); setAdminNotesError(''); }}
                    sx={{ mb: 2 }}
                    required
                    error={!!adminNotesError}
                    helperText={adminNotesError}
                  />
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="secondary">
                  ยกเลิก
                </Button>
                <Button onClick={handleSave} color="primary">
                  บันทึก
                </Button>
              </DialogActions>
            </Dialog>

            {/* Dialog ยืนยันการลบ */}
            <Dialog open={openConfirmDelete} onClose={handleCancelDelete}>
              <DialogTitle>ยืนยันการลบ</DialogTitle>
              <DialogContent>
                <Typography>คุณแน่ใจหรือไม่ว่าต้องการลบออเดอร์นี้? การลบนี้จะลบโฆษณาที่เกี่ยวข้องด้วย</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelDelete} color="primary">
                  ยกเลิก
                </Button>
                <Button onClick={handleConfirmDelete} color="error">
                  ลบ
                </Button>
              </DialogActions>
            </Dialog>

          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ManageOrders;