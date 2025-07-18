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

// --- ManageAds Component ---
const ManageAds = () => {
  const { handleLogout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // State variables
  const [ads, setAds] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [adToDelete, setAdToDelete] = useState(null);
  const [currentAd, setCurrentAd] = useState({
    id: null,
    title: '',
    content: '',
    link: '',
    status: 'pending',
    expiration_date: '',
    image: '',
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // ใช้สำหรับ TextField
  const [currentSearchTerm, setCurrentSearchTerm] = useState(''); // ใช้สำหรับส่งให้ fetchAds

  // Menu items for the drawer navigation
  const menuItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Manage Advertisements', path: '/manageadd', icon: <AddCircleIcon /> },
    { text: 'Manage User', path: '/manageuser', icon: <PeopleIcon /> },
    { text: 'Manage Post', path: '/managepost', icon: <AssignmentIcon /> },
    { text: 'Report posts', path: '/manage-reported-posts', icon: <ReportProblemIcon /> },
    { text: 'Manage Categories', path: '/managecategories', icon: <CategoryIcon /> },
  ];

  // Effect to check admin status on component mount
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  // Handlers for UI interactions
  const handleMenuClick = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  const handleAddClick = () => {
    setCurrentAd({
      id: null,
      title: '',
      content: '',
      link: '',
      status: 'pending',
      expiration_date: '',
      image: '',
    });
    setOpenDialog(true);
    setImageFile(null);
  };

  const handleEdit = (ad) => {
    setCurrentAd({
      ...ad,
      expiration_date: ad.expiration_date ? new Date(ad.expiration_date).toISOString().slice(0, 10) : '',
      status: ad.status ? ad.status.toLowerCase() : 'pending',
    });
    setOpenDialog(true);
    setImageFile(null);
  };

  const handleDeleteClick = (adId) => {
    setAdToDelete(adId);
    setOpenConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/ads/${adToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOpenConfirmDelete(false);
      setAdToDelete(null);
      fetchAds(currentSearchTerm); // ใช้ currentSearchTerm ในการ fetch หลังลบ
    } catch (error) {
      console.error('Error deleting ad:', error);
      alert('Failed to delete ad. Check console for details.');
    }
  };

  const handleCancelDelete = () => {
    setOpenConfirmDelete(false);
    setAdToDelete(null);
  };

  // Callback function to fetch advertisements
  // Uses useCallback to prevent unnecessary re-creation on re-renders
  const fetchAds = useCallback(async (query = '') => {
    const token = localStorage.getItem('token');
    try {
      let url;
      if (query) {
        url = `${process.env.REACT_APP_BASE_URL}/admin/search/ads?q=${encodeURIComponent(query)}`;
      } else {
        url = `${process.env.REACT_APP_BASE_URL}/ads`; 
      }
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // *** แก้ไขการจัดการ Response จาก Backend ตรงนี้ (ตามที่คุยกัน) ***
      if (response.data && response.data.message === "No advertisements found") {
        setAds([]); // ถ้าไม่มีข้อมูล ให้ตั้งค่า ads เป็น array ว่าง
        console.log(response.data.message); // แสดงข้อความที่ Backend ส่งมา
      } else if (Array.isArray(response.data)) {
        setAds(response.data); // ถ้าเป็น array ของโฆษณาโดยตรง (กรณี /ads ทั่วไป)
      } else if (response.data && Array.isArray(response.data.results)) {
        setAds(response.data.results); // ถ้า Backend ส่งเป็น { results: [...] } (กรณี search)
      } else {
        // กรณีที่ไม่คาดคิด หรือ Backend ส่งข้อมูลไม่เป็นไปตามที่คาด
        setAds([]);
        console.error('Unexpected response format:', response.data);
      }

    } catch (error) {
      console.error('Error fetching ads:', error);
      // *** เพิ่ม setAds([]) ตรงนี้เพื่อป้องกัน ads is not iterable เมื่อเกิด error ***
      setAds([]); 

      if (error.response) {
        console.error('Error Response Data:', error.response.data);
        console.error('Error Response Status:', error.response.status);
        console.error('Error Response Headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error Request:', error.request);
      } else {
        console.error('Error Message:', error.message);
      }

      // Handle specific error statuses
      if (error.response && error.response.status === 401) {
        handleLogout();
        navigate('/login');
      }
      // ไม่ต้อง alert แบบรวมๆ ว่า server error แล้ว เพราะเราจัดการ response.data.message แล้ว
      // และ setAds([]) ใน catch block ป้องกัน ads is not iterable
    }
  }, [handleLogout, navigate]);

  // Effect for debounced search. Runs when searchQuery changes after a delay.
  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentSearchTerm(searchQuery); // อัปเดต currentSearchTerm หลังจาก delay
    }, 300); // 300ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]); // fetchAds จะถูกเรียกเองเมื่อ currentSearchTerm เปลี่ยน

  // Effect to trigger fetchAds when currentSearchTerm changes
  useEffect(() => {
    fetchAds(currentSearchTerm);
  }, [currentSearchTerm, fetchAds]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentAd({
      id: null,
      title: '',
      content: '',
      link: '',
      status: 'pending',
      expiration_date: '',
      image: '',
    });
    setImageFile(null);
    fetchAds(currentSearchTerm); // Fetch ads ใหม่หลังจากปิด dialog (เพิ่ม/แก้ไขเสร็จ)
  };

  const handleClearImage = () => {
    setImageFile(null);
    setCurrentAd(prevAd => ({ ...prevAd, image: '' }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('title', currentAd.title || '');
    formData.append('content', currentAd.content || '');
    formData.append('link', currentAd.link || '');
    formData.append('status', currentAd.status ? currentAd.status.toLowerCase() : 'pending');

    if (currentAd.expiration_date) {
      formData.append('expiration_date', currentAd.expiration_date);
    }

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (currentAd.image === '') {
      formData.append('image_action', 'clear');
    }

    try {
      if (currentAd.id) {
        await axios.put(`${process.env.REACT_APP_BASE_URL}/ads/${currentAd.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/ads`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      setOpenDialog(false);
      fetchAds(currentSearchTerm); // ใช้ currentSearchTerm ในการ fetch หลังบันทึก
    } catch (error) {
      if (error.response) {
        console.error('Error saving ad (Response Data):', error.response.data);
        console.error('Error saving ad (Response Status):', error.response.status);
        alert(`Error: ${error.response.data.message || 'An error occurred while saving.'}`);
      } else if (error.request) {
        console.error('Error saving ad (No Response):', error.request);
        alert('Error: No response from server. Please check your network or server status.');
      } else {
        console.error('Error saving ad (Other):', error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  // Define custom sort order for ad statuses
  const statusOrder = {
    paid: 1,
    pending: 2,
    approved: 3,
    rejected: 4,
  };

  // Memoized sorted ads list for performance optimization
  // *** แก้ไขตรงนี้: ตรวจสอบ ads ก่อนใช้ .map() ***
  const sortedAds = useMemo(() => {
    if (!Array.isArray(ads) || ads.length === 0) return []; // ตรวจสอบว่าเป็น array และไม่ว่าง

    return [...ads].sort((a, b) => {
      const statusA = a.status ? String(a.status).toLowerCase() : 'pending';
      const statusB = b.status ? String(b.status).toLowerCase() : 'pending';

      const orderA = statusOrder[statusA] || 99;
      const orderB = statusOrder[statusB] || 99;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateA.getTime() - dateB.getTime();
    });
  }, [ads]);

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
              Manage Ads
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
                Manage Advertisements
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search ads (ID, title, content, status...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // อัปเดต searchQuery ที่ debounce
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                    sx={{ width: { xs: '100%', sm: 'auto' }, mb: { xs: 2, sm: 0 }, flexGrow: 1, mr: { sm: 2 } }}
                />
                <Button variant="contained" color="primary" onClick={handleAddClick}>
                    Add New Ad
                </Button>
            </Box>

            <TableContainer component={AnimatedPaper} sx={{ animation: `${fadeIn} 0.8s ease-out forwards`, animationDelay: '0.3s' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Content</TableCell>
                    <TableCell>Link</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Updated At</TableCell>
                    <TableCell>Expiration Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedAds.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        No advertisements found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedAds.map((ad) => (
                      <TableRow key={ad.id}>
                        <TableCell>{ad.id}</TableCell>
                        <TableCell>
                          {ad.image ? (
                            // *** ใช้ REACT_APP_BASE_URL นำหน้า image path ***
                            <img
                              src={`${process.env.REACT_APP_BASE_URL}${ad.image}`}
                              alt={ad.title}
                              style={{ width: '100px', height: 'auto', borderRadius: '5px' }}
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">No Image</Typography>
                          )}
                        </TableCell>
                        <TableCell>{ad.title}</TableCell>
                        <TableCell>{ad.content}</TableCell>
                        <TableCell>
                          {ad.link ? (
                            <a href={ad.link} target="_blank" rel="noopener noreferrer">{ad.link}</a>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>{new Date(ad.created_at).toLocaleString('en-GB')}</TableCell>
                        <TableCell>{new Date(ad.updated_at).toLocaleString('en-GB')}</TableCell>
                        <TableCell>
                          {ad.expiration_date ? new Date(ad.expiration_date).toLocaleString('en-GB') : 'N/A'}
                        </TableCell>
                        <TableCell>{ad.status ? String(ad.status).toLowerCase() : 'N/A'}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEdit(ad)} color="edit" sx={{ mr: 1 }}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteClick(ad.id)} color="delete">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} PaperComponent={AnimatedPaper} PaperProps={{ sx: { animationDelay: '0s', '&:hover': { transform: 'none', boxShadow: '0 6px 15px rgba(0,0,0,0.05)' } } }}>
              <DialogTitle>{currentAd.id ? 'Edit Advertisement' : 'Add New Advertisement'}</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Title"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={currentAd.title || ''}
                  onChange={(e) => setCurrentAd({ ...currentAd, title: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Content"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={currentAd.content || ''}
                  onChange={(e) => setCurrentAd({ ...currentAd, content: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Link"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={currentAd.link || ''}
                  onChange={(e) => setCurrentAd({ ...currentAd, link: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="raised-button-file"
                      type="file"
                      onChange={(e) => setImageFile(e.target.files[0])}
                  />
                  <label htmlFor="raised-button-file">
                      <Button variant="outlined" component="span" startIcon={<AddCircleIcon />}>
                          Upload Image
                      </Button>
                  </label>
                  {(imageFile || (currentAd.image && currentAd.image !== `${process.env.REACT_APP_BASE_URL}null` && currentAd.image !== `${process.env.REACT_APP_BASE_URL}undefined`)) && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleClearImage}
                      startIcon={<CancelIcon />}
                      sx={{ ml: 2 }}
                    >
                      Clear Image
                    </Button>
                  )}
                </Box>

                {imageFile && <Typography variant="body2" sx={{ ml: 1, mb: 1 }}>Selected: {imageFile.name}</Typography>}

                {(imageFile || (currentAd.image && currentAd.image !== `${process.env.REACT_APP_BASE_URL}null` && currentAd.image !== `${process.env.REACT_APP_BASE_URL}undefined`)) && (
                    <img
                        src={imageFile ? URL.createObjectURL(imageFile) : `${process.env.REACT_APP_BASE_URL}${currentAd.image}`}
                        alt="Ad preview"
                        style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', marginBottom: '16px' }}
                    />
                )}

                <TextField
                  margin="dense"
                  label="Expiration Date"
                  type="date"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={currentAd.expiration_date || ''}
                  onChange={(e) => setCurrentAd({ ...currentAd, expiration_date: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={currentAd.status || 'pending'}
                    onChange={(e) => setCurrentAd({ ...currentAd, status: e.target.value })}
                    label="Status"
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleSave} color="primary">
                  {currentAd.id ? 'Save Changes' : 'Add Advertisement'}
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={openConfirmDelete} onClose={handleCancelDelete}>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogContent>
                <Typography>Are you sure you want to delete this advertisement?</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelDelete} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleConfirmDelete} color="error">
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ManageAds;