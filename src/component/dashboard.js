import React, { useState, useEffect, useMemo } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CssBaseline,
  Paper,
  ListItemIcon,
  Divider,
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CategoryIcon from '@mui/icons-material/Category';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import moment from 'moment';

import { createTheme, ThemeProvider, styled, alpha } from '@mui/material/styles';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// ===== Animations =====
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

// ===== Theme: Balanced neutral (white/black/gray) + pastel accents =====
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
    fontFamily: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'].join(','),
    h3: { fontWeight: 800, fontSize: '2.5rem', letterSpacing: '-0.02em' },
    h5: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#FFFFFF',
          border: '1px solid rgba(15,17,21,0.06)',
          borderRadius: 16,
          boxShadow: '0 12px 30px rgba(15,17,21,0.06)'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, rgba(19,22,29,0.96), rgba(19,22,29,0.92))',
          color: '#FFFFFF',
          borderRight: '1px solid rgba(255,255,255,0.06)'
        }
      }
    }
  }
});

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
  
  // ===== Micro components =====
  const GlassAppBar = styled(AppBar)(({ theme }) => ({
    background: 'rgba(19,22,29,0.85)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    boxShadow: '0 12px 28px rgba(15,17,21,0.18)',
    borderRadius: 0,
    left: 0,
    right: 0,
    width: '100vw',
    color: '#FFFFFF',
    '& .MuiToolbar-root': { alignItems: 'center' }
  }));
  
  const Card = styled(Paper)(() => ({
    position: 'relative',
    overflow: 'hidden',
    transformStyle: 'preserve-3d',
    transition: 'transform .35s ease, box-shadow .35s ease',
    '&:hover': {
      transform: 'translateY(-6px) scale(1.01)'
    }
  }));

// ===== Dashboard =====
const Dashboard = () => {
  const { handleLogout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const menuItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Manage Advertisements', path: '/manageadd', icon: <AddCircleIcon /> },
    { text: 'Manage Order', path: '/manageorder', icon: <ShoppingCartIcon /> },
    { text: 'Manage User', path: '/manageuser', icon: <PeopleIcon /> },
    { text: 'Manage Post', path: '/managepost', icon: <AssignmentIcon /> },
    { text: 'Report posts', path: '/manage-reported-posts', icon: <ReportProblemIcon /> },
    { text: 'Manage Categories', path: '/managecategories', icon: <CategoryIcon /> },
  ];

  const ALL_CATEGORIES = [
    'Electronics & Gadgets',
    'Furniture',
    'Outdoor Gear',
    'Beauty Products',
    'Accessories',
  ];
  

  useEffect(() => { if (!isAdmin()) navigate('/login'); }, [isAdmin, navigate]);

  const [newUsersData, setNewUsersData] = useState([]);
  const [totalPostsData, setTotalPostsData] = useState([]);
  const [categoryPopularityData, setCategoryPopularityData] = useState([]);
  const [ageInterestData, setAgeInterestData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin()) return;
      try {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNewUsersData(res.data.new_users_per_month);
        setTotalPostsData(res.data.total_posts_per_month);
        setCategoryPopularityData(res.data.category_popularity);
        setAgeInterestData(res.data.age_interest);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        if (err?.response?.status === 401) { handleLogout(); navigate('/login'); }
      }
    };
    fetchData();
  }, [handleLogout, isAdmin, navigate]);

  const newUserChartData = useMemo(() => ({
    labels: newUsersData.map(d => moment(d.month_year).format('MM/YYYY')),
    datasets: [{
      label: 'New Users',
      data: newUsersData.map(d => d.new_users),
      backgroundColor: '#DDEEFF',
      borderColor: '#B8D3FF',
      borderWidth: 1,
      borderRadius: 10,
    }]
  }), [newUsersData]);

  const totalPostChartData = useMemo(() => ({
    labels: totalPostsData.map(d => moment(d.month_year).format('MM/YYYY')),
    datasets: [{
      label: 'Total Posts',
      data: totalPostsData.map(d => d.total_posts),
      backgroundColor: '#FFE6F2',
      borderColor: '#FFC7E1',
      borderWidth: 1,
      borderRadius: 10,
    }]
  }), [totalPostsData]);

  const categoryPopularityChartData = useMemo(() => ({
    labels: ALL_CATEGORIES,
    datasets: [
      {
        label: 'Total Engagement',
        data: ALL_CATEGORIES.map(cat => {
          const f = categoryPopularityData.find(d => d.CategoryName === cat);
          return f ? Number(f.TotalEngagement) || 0 : 0;
        }),
        backgroundColor: '#E9FFF5', borderColor: '#C9F5E5', borderWidth: 1, borderRadius: 10, maxBarThickness: 26,
      },
      {
        label: 'Male Engagement',
        data: ALL_CATEGORIES.map(cat => {
          const f = categoryPopularityData.find(d => d.CategoryName === cat);
          return f ? Number(f.MaleEngagement) || 0 : 0;
        }),
        backgroundColor: '#DDEEFF', borderColor: '#B8D3FF', borderWidth: 1, borderRadius: 10, maxBarThickness: 26,
      },
      {
        label: 'Female Engagement',
        data: ALL_CATEGORIES.map(cat => {
          const f = categoryPopularityData.find(d => d.CategoryName === cat);
          return f ? Number(f.FemaleEngagement) || 0 : 0;
        }),
        backgroundColor: '#FFE6F2', borderColor: '#FFC7E1', borderWidth: 1, borderRadius: 10, maxBarThickness: 26,
      },
      {
        label: 'Other Engagement',
        data: ALL_CATEGORIES.map(cat => {
          const f = categoryPopularityData.find(d => d.CategoryName === cat);
          return f ? Number(f.OtherEngagement) || 0 : 0;
        }),
        backgroundColor: '#E5E7EB', borderColor: '#D1D5DB', borderWidth: 1, borderRadius: 10, maxBarThickness: 26,
      },
    ],
  }), [categoryPopularityData]);
  

  const AGE_BUCKETS = ['18-25','26-35','36+','Other'];

const ageInterestChartData = useMemo(() => ({
  labels: ALL_CATEGORIES,
  datasets: [
    {
      label: '18-25',
      data: ALL_CATEGORIES.map(cat => {
        const f = ageInterestData.find(d => d.CategoryName === cat && d.AgeGroup === '18-25');
        return f ? Number(f.TotalEngagement) || 0 : 0;
      }),
      backgroundColor: 'rgba(181, 208, 255, 0.8)', borderColor: 'rgba(151, 186, 246, 1)', borderWidth: 1, borderRadius: 10, maxBarThickness: 26,
    },
    {
      label: '26-35',
      data: ALL_CATEGORIES.map(cat => {
        const f = ageInterestData.find(d => d.CategoryName === cat && d.AgeGroup === '26-35');
        return f ? Number(f.TotalEngagement) || 0 : 0;
      }),
      backgroundColor: 'rgba(255, 198, 221, 0.8)', borderColor: 'rgba(248, 172, 204, 1)', borderWidth: 1, borderRadius: 10, maxBarThickness: 26,
    },
    {
      label: '36+',
      data: ALL_CATEGORIES.map(cat => {
        const f = ageInterestData.find(d => d.CategoryName === cat && d.AgeGroup === '36+');
        return f ? Number(f.TotalEngagement) || 0 : 0;
      }),
      backgroundColor: 'rgba(201, 245, 229, 0.8)', borderColor: 'rgba(171, 232, 212, 1)', borderWidth: 1, borderRadius: 10, maxBarThickness: 26,
    },
    {
      label: 'Other',
      data: ALL_CATEGORIES.map(cat => {
        const f = ageInterestData.find(d => d.CategoryName === cat && d.AgeGroup === 'Other');
        return f ? Number(f.TotalEngagement) || 0 : 0;
      }),
      backgroundColor: 'rgba(229, 231, 235, 0.9)', borderColor: 'rgba(209, 213, 219, 1)', borderWidth: 1, borderRadius: 10, maxBarThickness: 26,
    },
  ],
}), [ageInterestData]);


const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 900, easing: 'easeOutQuart' },
    plugins: {
      legend: { position: 'top', labels: { color: theme.palette.text.secondary, font: { family: theme.typography.fontFamily, size: 12 } } },
      tooltip: { backgroundColor: '#FFFFFF', titleColor: theme.palette.text.primary, bodyColor: theme.palette.text.secondary, borderColor: 'rgba(0,0,0,0.08)', borderWidth: 1 },
    },
    layout: { padding: { right: 12 } },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: theme.palette.text.secondary,
          maxRotation: 0,
          autoSkip: false,
          callback: function(value) {
            const s = String(this.getLabelForValue(value));
            if (s.length <= 14) return s;
            const words = s.split(' ');
            const lines = [];
            let line = '';
            for (const w of words) {
              if ((line + w).length > 14) { lines.push(line.trim()); line = w + ' '; }
              else { line += w + ' '; }
            }
            if (line) lines.push(line.trim());
            return lines;
          }
        },
      },
      y: { grid: { color: 'rgba(27,31,39,0.06)' }, ticks: { color: theme.palette.text.secondary } }
    },
    barPercentage: 0.9,
    categoryPercentage: 0.6,
  }), []);
  

  if (!isAdmin()) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display:'grid', placeItems:'center', minHeight:'100vh', bgcolor:'background.default', color:'text.primary' }}>
          <Paper sx={{ p: 5, textAlign:'center' }}>
            <Typography variant="h5" gutterBottom>Access Denied</Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>You are not authorized to view this page. Please log in with administrator credentials.</Typography>
            <Button variant="contained" onClick={() => navigate('/login')}>Go to Login</Button>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Background */}
      <Backdrop>
        <Aurora />
        {[
          { size: 6, x: 12, y: 22, delay: 0.2 },
          { size: 10, x: 28, y: 66, delay: 0.4 },
          { size: 8, x: 70, y: 28, delay: 0.1 },
          { size: 12, x: 84, y: 58, delay: 0.5 },
          { size: 9, x: 45, y: 40, delay: 0.3 },
          { size: 7, x: 60, y: 75, delay: 0.2 },
        ].map((p, i) => (<Particle key={i} {...p} />))}
      </Backdrop>

      {/* App Bar */}
      <GlassAppBar position="fixed" elevation={0} sx={{ zIndex: 10 }}>
        <Toolbar sx={{ gap: 1 }}>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)} aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: '.02em' }}>
            Dashboard
          </Typography>
          <Button variant="contained" color="inherit" onClick={handleLogout} startIcon={<ExitToAppIcon />} sx={{ bgcolor: '#FFFFFF', color: theme.palette.neutral[900], borderRadius: 0, px: 2.2, '&:hover': { bgcolor: theme.palette.neutral[100] } }}>
            Logout
          </Button>
        </Toolbar>
      </GlassAppBar>

      {/* Main */}
      <Box component="main" sx={{ position:'relative', zIndex: 1, px: { xs: 2, md: 4 }, pt: { xs: 11, md: 12 }, pb: 6, maxWidth: 1280, mx: 'auto' }}>
        {/* HERO: Centered, larger welcome */}
        <Box sx={{ display:'grid', placeItems:'center', textAlign:'center', minHeight:{ xs:'10vh', md:'5vh' }, mt:{ xs: 2, md: 6 }, mb:{ xs: 4, md: 7 } }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
            <Typography component="h1" sx={{ fontWeight: 900, letterSpacing: '-0.02em', color: 'text.primary', fontSize: { xs: '3rem', md: '5rem', lg: '5.4rem' } }}>
              Welcome, Admin!
            </Typography>
          </motion.div>
        </Box>

        {/* Dashboard Cards */}
        <Grid container spacing={3.2}>
          {[
            { title: 'New Users Overview', data: newUserChartData },
            { title: 'Total Posts Overview', data: totalPostChartData },
            { title: 'Category Popularity', data: categoryPopularityChartData },
            { title: 'Total Engagement by Age', data: ageInterestChartData },
          ].map((card, i) => (
            <Grid item xs={12} md={6} key={card.title}>
              <motion.div
                initial={{ opacity: 0, y: 22, rotateX: -6 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: 'anticipate' }}
              >
                <Card sx={{ height: 420, p: 2.2 }}>
                  <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb: 1.5 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>{card.title}</Typography>
                    <Box sx={{ px: 1.5, py: .5, borderRadius: 999, fontSize: 12, color: theme.palette.neutral[900], fontWeight: 800, background: theme.palette.pastel.lemon }}>
                      Live
                    </Box>
                  </Box>
                  <Box sx={{ position:'relative', height: 340 }}>
                    <Bar data={card.data} options={chartOptions} />
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Drawer */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280, height: '100%' }} role="presentation" onClick={() => setDrawerOpen(false)}>
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
                  mx: 1.2, my: 0.6, borderRadius: 0,
                  color: '#fff',
                  '& .MuiListItemIcon-root': { color: '#fff' },
                  '&.Mui-selected': { background: alpha('#fff',0.08) },
                  '&:hover': { background: alpha('#fff',0.12) }
                }}
              >
                <ListItemIcon sx={{ minWidth: 38 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </ThemeProvider>
  );
};

export default Dashboard;
